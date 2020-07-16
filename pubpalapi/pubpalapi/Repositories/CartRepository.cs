using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class CartRepository
    {
        private CartDA cartDA;
        private PurchaseRepository purchaseRepo;

        public CartRepository(string dbName, string storeName, string purchaseStoreName = "", string userStoreName = "")
        {
            cartDA = new CartDA(dbName, storeName);
            if (!string.IsNullOrWhiteSpace(purchaseStoreName))
            {
                purchaseRepo = new PurchaseRepository(dbName, purchaseStoreName, userStoreName);
            }
        }

        public IEnumerable<CartModel> GetCarts()
        {
            var carts = cartDA.GetCarts();
            return carts;
        }

        public CartModel GetCartById(string id)
        {
            var cart = cartDA.GetCartById(id);
            return cart;
        }

        public CartModel GetCartByUserId(string userid)
        {
            var cart = cartDA.GetCartByUserId(userid);
            return cart;
        }

        public CartPurchaseModel GetCartPurchaseByCartPurchaseId(string id, string cartPurchaseId)
        {
            var cart = cartDA.GetCartById(id);
            var cartPurchase = cart.purchases.FirstOrDefault(a => a.cartid == cartPurchaseId);
            return cartPurchase;
        }

        public string AddCart(CartModel newCart)
        {
            foreach (var cartPurch in newCart.purchases)
            {
                cartPurch.cartid = Guid.NewGuid().ToString();
            }
            var cartid = cartDA.CreateCart(newCart);
            return cartid;
        }

        public bool AddPurchaseToCart(string id, CartPurchaseModel cartPurchase)
        {
            var cart = cartDA.GetCartById(id);
            cartPurchase.cartid = Guid.NewGuid().ToString();
            var cartPurchases = cart.purchases.ToList();
            cartPurchases.Add(cartPurchase);
            cart.purchases = cartPurchases.ToArray();
            var updated = cartDA.UpdateCart(cart);
            return updated;
        }

        public bool RemovePurchaseFromCart(string id, string cartPurchaseId)
        {
            var cart = cartDA.GetCartById(id);
            cart.purchases = cart.purchases.Where(a => a.cartid != cartPurchaseId).ToArray();
            var updated = cartDA.UpdateCart(cart);
            return updated;
        }

        public bool DeleteCart(string id)
        {
            var deleted = cartDA.DeleteCart(id);
            return deleted;
        }

        public bool MakePurchases(string id)
        {
            var cart = cartDA.GetCartById(id);
            bool allPurchasesMade = true;
            var purchaseIds = new List<string>();
            //foreach (var cartPurchase in cart.purchases)
            //{
            //    var purchaseid = purchaseRepo.CreatePurchase(cartPurchase);
            //    if (!string.IsNullOrWhiteSpace(purchaseid))
            //    {
            //        purchaseIds.Add(purchaseid);
            //    }

            //    if (allPurchasesMade == true && string.IsNullOrWhiteSpace(purchaseid))
            //    {
            //        allPurchasesMade = false;
            //    }
            //}

            //if (allPurchasesMade)
            //{
            //    cartDA.DeleteCart(id);
            //}
            //else
            //{
            //    cart.purchases = cart.purchases.Where(a => !purchaseIds.Contains(a.cartid)).ToArray();
            //    cartDA.UpdateCart(cart);
            //}

            return allPurchasesMade;
        }
    }
}
