import {
  createContext,
  useContext,
  createSignal,
  createEffect,
  createMemo,
  createResource,
  type JSX,
} from "solid-js";

export interface CartItem {
  menuItemId: number;
  quantity: number;
}

export interface MenuItemDetails {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

export interface CartItemWithDetails extends CartItem {
  details?: MenuItemDetails;
}

interface CartContextType {
  items: () => CartItem[];
  addItem: (menuItemId: number, quantity?: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  removeItem: (menuItemId: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  cartWithDetails: () => CartItemWithDetails[];
  total: () => number;
  isLoading: () => boolean;
  refetchDetails: () => void;
  isPanelOpen: () => boolean;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const CartContext = createContext<CartContextType>();

const CART_STORAGE_KEY = "restaurant_cart";

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function CartProvider(props: { children: JSX.Element }) {
  const [items, setItems] = createSignal<CartItem[]>(loadCart());
  const [isPanelOpen, setIsPanelOpen] = createSignal(false);

  // Persist to localStorage whenever items change
  createEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items()));
  });

  // Fetch menu item details for cart items
  const fetchMenuDetails = async (cartItems: CartItem[]): Promise<MenuItemDetails[]> => {
    if (cartItems.length === 0) return [];

    const ids = cartItems.map((item) => item.menuItemId).join(",");
    const res = await fetch(`/api/menu/items?ids=${ids}`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.items;
  };

  const [menuDetails, { refetch: refetchDetails }] = createResource(items, fetchMenuDetails);

  const cartWithDetails = createMemo(() => {
    const details = menuDetails() || [];
    return items().map((item) => ({
      ...item,
      details: details.find((d) => d.id === item.menuItemId),
    }));
  });

  const total = createMemo(() => {
    return cartWithDetails().reduce((sum, item) => {
      return sum + (item.details?.price || 0) * item.quantity;
    }, 0);
  });

  function addItem(menuItemId: number, quantity: number = 1) {
    setItems((prev) => {
      const existing = prev.find((item) => item.menuItemId === menuItemId);
      if (existing) {
        return prev.map((item) =>
          item.menuItemId === menuItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { menuItemId, quantity }];
    });
  }

  function updateQuantity(menuItemId: number, quantity: number) {
    if (quantity <= 0) {
      removeItem(menuItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.menuItemId === menuItemId ? { ...item, quantity } : item))
    );
  }

  function removeItem(menuItemId: number) {
    setItems((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
  }

  function clearCart() {
    setItems([]);
  }

  function itemCount() {
    return items().reduce((sum, item) => sum + item.quantity, 0);
  }

  function isLoading() {
    return menuDetails.loading;
  }

  function openPanel() {
    setIsPanelOpen(true);
  }

  function closePanel() {
    setIsPanelOpen(false);
  }

  function togglePanel() {
    setIsPanelOpen((prev) => !prev);
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        itemCount,
        cartWithDetails,
        total,
        isLoading,
        refetchDetails,
        isPanelOpen,
        openPanel,
        closePanel,
        togglePanel,
      }}
    >
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
