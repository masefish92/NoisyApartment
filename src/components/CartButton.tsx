"use client";

import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useCart } from "@/components/CartContext";

export default function CartButton() {
  const [open, setOpen] = useState(false);
  const { items, count, subtotal, updateQuantity, removeItem } = useCart();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        className="relative p-2 rounded-full hover:bg-surface-container-low transition-all text-primary"
      >
        <ShoppingBag size={20} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-secondary text-on-secondary-container text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div
            className="absolute inset-0 bg-inverse-surface/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-sm h-full bg-surface-container-lowest border-l border-outline-variant flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant">
              <h3 className="font-headline-md text-headline-md text-primary">
                Your Cart
              </h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close cart"
                className="text-on-surface-variant hover:text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <p className="font-body-md text-on-surface-variant py-12 text-center">
                  Your cart is quiet. Add something from the Shop.
                </p>
              ) : (
                items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-outline-variant/30 pb-4"
                  >
                    <div className="flex-1">
                      <p className="font-headline-md text-headline-md text-[16px] text-primary">
                        {item.name}
                      </p>
                      <p className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-1">
                        {item.category}
                      </p>
                      <div className="flex items-center gap-3 mt-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                          className="w-6 h-6 flex items-center justify-center border border-outline-variant hover:bg-surface-container-low transition-colors"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="font-body-md text-sm w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                          className="w-6 h-6 flex items-center justify-center border border-outline-variant hover:bg-surface-container-low transition-colors"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className="font-body-md text-on-surface-variant">
                        ${item.price * item.quantity}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        aria-label={`Remove ${item.name}`}
                        className="text-outline hover:text-error transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-outline-variant px-6 py-6 space-y-4">
              <div className="flex justify-between font-headline-md text-headline-md text-primary">
                <span>Subtotal</span>
                <span>${subtotal}</span>
              </div>
              <button
                disabled={items.length === 0}
                onClick={() => alert("Checkout is not implemented in this demo.")}
                className="w-full bg-primary text-on-primary px-6 py-3 rounded-lg font-label-sm text-label-sm uppercase tracking-widest hover:bg-primary-container transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
