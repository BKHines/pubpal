using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using PayPalHttp;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Text.Json;

namespace pubpalapi.PaymentIntegration.PayPal
{
    public class CreateOrder
    {
        public async static Task<HttpResponse> ExecuteCreateOrder(PurchaseModel newPurchase)
        {
            var order = new OrderRequest()
            {
                CheckoutPaymentIntent = "CAPTURE",
                ApplicationContext = new ApplicationContext()
                {
                    BrandName = "PubPal",
                    LandingPage = "LOGIN",
                    ReturnUrl = "https://pubpalapp.dynu.net/return",
                    CancelUrl = "https://pubpalapp.dynu.net/cancel",
                    UserAction = "CONTINUE"
                },
                PurchaseUnits = new List<PurchaseUnitRequest>()
                {
                    new PurchaseUnitRequest()
                    {
                        ReferenceId = newPurchase._id,
                        Description = newPurchase.category,
                        CustomId = newPurchase.category,
                        SoftDescriptor = newPurchase.category,
                        AmountWithBreakdown = new AmountWithBreakdown()
                        {
                            CurrencyCode = "USD",
                            Value = (newPurchase.price + newPurchase.tip + (newPurchase.feewaived ? newPurchase.fee : 0)).ToString("0.0#"),
                            AmountBreakdown = new AmountBreakdown()
                            {
                                ItemTotal = new Money
                                {
                                    CurrencyCode = "USD",
                                    Value = (newPurchase.price + newPurchase.tip).ToString("0.0#")
                                },
                                Handling = new Money
                                {
                                    CurrencyCode = "USD",
                                    Value = (newPurchase.feewaived ? newPurchase.fee : 0).ToString("0.0#")
                                }
                            }
                        },
                        Items = new List<Item>
                        {
                            new Item
                            {
                                Name = newPurchase.itemname,
                                Description = String.Join(", ", newPurchase.ingredients),
                                Sku = newPurchase._id,
                                UnitAmount = new Money
                                {
                                    CurrencyCode = "USD",
                                    Value = newPurchase.price.ToString("0.0#")
                                },
                                Quantity = "1",
                                Category = "PHYSICAL_GOODS"
                            },
                            new Item
                            {
                                Name = "Purchase Tip",
                                Description = "Tip for beverage purchase",
                                UnitAmount = new Money
                                {
                                    CurrencyCode = "USD",
                                    Value = newPurchase.tip.ToString("0.0#")
                                },
                                Quantity = "1",
                                Category = "PHYSICAL_GOODS"
                            },
                            new Item
                            {
                                Name = "PubPal Fee",
                                Description = "PubPal Service Fee" + (newPurchase.feewaived ? $" ( ${newPurchase.fee.ToString("0.0#")} waived)" : string.Empty),
                                UnitAmount = new Money
                                {
                                    CurrencyCode = "USD",
                                    Value = newPurchase.feewaived ? "0.00" : newPurchase.fee.ToString("0.0#")
                                },
                                Quantity = "1",
                                Category = "PHYSICAL_GOODS"
                            }
                        }
                    }
                },
            };

            var ppEnv = new SandboxEnvironment("Af_0Svc1eq0MW130AtSNaXXq5N4PmyGxBcazk7eGm1Jx5tYJLEz2AI2nuVxyABqb4jtbybhFlu0mdu4t",
                                                "EIpDSdPZ_JYuNFImcv9NClal2LUIwU-kzswqtRpMrlRkgt3Tf_RR2Zh3n1CTWnN8rCzQJE3gGegk0KuF");
            var ppreq = new OrdersCreateRequest();
            ppreq.Headers.Add("prefer", "return=representation");
            ppreq.RequestBody(order);
            var ppclient = new PayPalHttpClient(ppEnv);
            var response = await ppclient.Execute(ppreq);

            var result = response.Result<Order>();
            Console.WriteLine("Status: {0}", result.Status);
            Console.WriteLine("Order Id: {0}", result.Id);
            Console.WriteLine("Intent: {0}", result.CheckoutPaymentIntent);
            Console.WriteLine("Links:");
            foreach (LinkDescription link in result.Links)
            {
                Console.WriteLine("\t{0}: {1}\tCall Type: {2}", link.Rel, link.Href, link.Method);
            }
            AmountWithBreakdown amount = result.PurchaseUnits[0].AmountWithBreakdown;
            Console.WriteLine("Total Amount: {0} {1}", amount.CurrencyCode, amount.Value);
            Console.WriteLine("Response JSON: \n {0}", System.Text.Json.JsonSerializer.Serialize(result));

            return response;
        }
    }
}
