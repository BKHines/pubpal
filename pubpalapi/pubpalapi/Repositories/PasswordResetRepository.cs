using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class PasswordResetRepository
    {
        private PasswordResetDA pwResetDA;
        private UserRepository userRepo;
        private SellerRepository sellerRepo;

        public PasswordResetRepository(string dbName, string storeName, string sellerStoreName = "", string userStoreName = "")
        {
            pwResetDA = new PasswordResetDA(dbName, storeName);
            if (!string.IsNullOrWhiteSpace(sellerStoreName) && !string.IsNullOrWhiteSpace(userStoreName))
            {
                sellerRepo = new SellerRepository(dbName, sellerStoreName);
                userRepo = new UserRepository(dbName, userStoreName);
            }
        }

        public bool HasResetRequestExpired(string id)
        {
            var resetReq = pwResetDA.GetPasswordResetById(id);
            if (resetReq.completestatus != null || resetReq.cancelledstatus != null)
            {
                return true;
            }
            else
            {
                var tsDiff = DateTime.UtcNow - resetReq.requeststatus.requesttimestamp;
                return tsDiff.TotalHours > 2;
            }
        }

        public void CreatePasswordResetRequest(string email, string ip)
        {
            PersonModel person = userRepo.GetUserByEmail(email);

            if (person is null)
            {
                person = sellerRepo.GetSellerByEmail(email);
            }

            var pwReset = new PasswordResetModel()
            {
                personemail = email,
                personid = person._id,
                temporarypassword = Guid.NewGuid().ToString(),
                requeststatus = new PasswordResetStatusModel()
                {
                    requestip = ip,
                    requesttimestamp = DateTime.UtcNow
                }
            };

            var pwResetId = pwResetDA.CreatePasswordResetRequest(pwReset);

            var to = person.email;
            var from = "bigsimpleproductions@gmail.com";
            var mailMsg = new MailMessage(from, to);
            mailMsg.Subject = "Your PubPal password has been reset";
            mailMsg.Body = $@"A temporary password has been generated for your account: {pwReset.temporarypassword}.  
Copy the temporary password above and click here to set your new password: https://localhost:4200/resetpasswordupdate/{pwResetId}/{email}.
If you did not request your password reset, please report this activity by cancelling this request: https://localhost:4200/cancelreset/{pwResetId}.";
            var client = new SmtpClient("smtp.gmail.com", 587);
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential("bigsimpleproductions@gmail.com", "Big$imp1e");
            client.EnableSsl = true;
            client.Send(mailMsg);
        }

        public bool ChangePasswordAndCompletePasswordResetRequest(ChangePasswordResetRequest resetRequest)
        {
            var userUpdated = false;
            PersonModel person = userRepo.GetUserByEmail(resetRequest.email);

            if (person is null)
            {
                person = sellerRepo.GetSellerByEmail(resetRequest.email);
                var changePasswordReq = new ChangePasswordRequest()
                {
                    id = person._id,
                    newpassword = resetRequest.newpassword,
                    confirmpassword = resetRequest.confirmpassword
                };
                userUpdated = sellerRepo.ChangePassword(changePasswordReq);
            }
            else
            {
                var changePasswordReq = new ChangePasswordRequest()
                {
                    id = person._id,
                    newpassword = resetRequest.newpassword,
                    confirmpassword = resetRequest.confirmpassword
                };
                userUpdated = userRepo.ChangePassword(changePasswordReq);
            }

            pwResetDA.CompletePasswordResetRequest(resetRequest.resetid, resetRequest.ip);

            return userUpdated;
        }

        public void CancelPasswordResetRequest(string id, string ip)
        {
            pwResetDA.CancelPasswordResetRequest(id, ip);
        }
    }
}
