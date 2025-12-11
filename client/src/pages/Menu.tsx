import { createSignal, createResource, For, Show } from "solid-js";
import { useFlash } from "../contexts/FlashContext";
import { useCart } from "../contexts/CartContext";
import CartSidePanel from "../components/cart/CartSidePanel";

interface MenuItem {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

async function fetchMenuItems(): Promise<MenuItem[]> {
  const res = await fetch("/api/menu");
  if (!res.ok) throw new Error("Failed to fetch menu");
  const data = await res.json();
  return data.items;
}

async function fetchCategories(): Promise<string[]> {
  const res = await fetch("/api/menu/categories");
  if (!res.ok) throw new Error("Failed to fetch categories");
  const data = await res.json();
  return data.categories;
}

export default function Menu() {
  const { setFlash } = useFlash();
  const { addItem, itemCount, openPanel, refetchDetails } = useCart();
  const [selectedCategory, setSelectedCategory] = createSignal<string | null>(null);
  const [addingToCart, setAddingToCart] = createSignal<number | null>(null);

  const [menuItems] = createResource(fetchMenuItems);
  const [categories] = createResource(fetchCategories);

  const filteredItems = () => {
    const items = menuItems();
    if (!items) return [];
    const category = selectedCategory();
    if (!category) return items;
    return items.filter((item) => item.category === category);
  };

  const addToCart = (menuItemId: number) => {
    setAddingToCart(menuItemId);

    addItem(menuItemId, 1);
    refetchDetails();
    setFlash("Added to your order", "success");

    setTimeout(() => {
      setAddingToCart(null);
    }, 300);
  };

  return (
    <div class="menu-page">
      <div class="menu-header">
        <h1>Our Menu</h1>
        <button class="cart-button" onClick={openPanel} title="View Cart">
          🛒
          <Show when={itemCount() > 0}>
            <span class="cart-count">{itemCount()}</span>
          </Show>
        </button>
      </div>

      <Show when={!menuItems.loading} fallback={<p>Loading our menu...</p>}>
        <Show when={menuItems()} fallback={<p>Unable to load menu</p>}>
          <div class="menu-filters">
            <button
              class={selectedCategory() === null ? "filter-active" : ""}
              onClick={() => setSelectedCategory(null)}
            >
              All Dishes
            </button>
            <For each={categories()}>
              {(category) => (
                <button
                  class={selectedCategory() === category ? "filter-active" : ""}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              )}
            </For>
          </div>

          <div class="menu-grid">
            <For each={filteredItems()}>
              {(item) => (
                <div class="menu-card">
                  <Show when={item.image_url}>
                    <img src={item.image_url!} alt={item.name} />
                  </Show>
                  <div class="menu-card-content">
                    <h3>{item.name}</h3>
                    <p class="menu-category">{item.category}</p>
                    <Show when={item.description}>
                      <p class="menu-description">{item.description}</p>
                    </Show>
                    <p class="menu-price">£{Number(item.price).toFixed(2)}</p>
                    <button
                      class="add-to-cart-btn"
                      onClick={() => addToCart(item.id)}
                      disabled={addingToCart() === item.id}
                    >
                      {addingToCart() === item.id ? "Adding..." : "Add to Order"}
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>

      <CartSidePanel />
    </div>
  );
}
