import { createSignal, createResource, For, Show } from "solid-js";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

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
  const { user } = useAuth();
  const { setFlash } = useFlash();
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

  const addToCart = async (menuItemId: number) => {
    if (!user()) {
      setFlash("Please log in to add items to cart", "error");
      return;
    }

    setAddingToCart(menuItemId);

    try {
      const res = await fetch("/api/cart/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ menuItemId, quantity: 1 }),
      });

      if (res.ok) {
        setFlash("Item added to cart", "success");
      } else {
        const data = await res.json();
        setFlash(data.message || "Failed to add item to cart", "error");
      }
    } catch (error) {
      setFlash("Failed to add item to cart", "error");
    } finally {
      setAddingToCart(null);
    }
  };

  return (
    <div class="page">
      <h1>Our Menu</h1>

      <Show when={!menuItems.loading} fallback={<p>Loading menu...</p>}>
        <Show when={menuItems()} fallback={<p>Failed to load menu</p>}>
          <div class="category-filter">
            <button
              class={`btn ${selectedCategory() === null ? "btn-primary" : "btn-secondary"}`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            <For each={categories()}>
              {(category) => (
                <button
                  class={`btn ${selectedCategory() === category ? "btn-primary" : "btn-secondary"}`}
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
                    <img src={item.image_url!} alt={item.name} class="menu-image" />
                  </Show>
                  <div class="menu-card-content">
                    <h3>{item.name}</h3>
                    <p class="menu-category">{item.category}</p>
                    <Show when={item.description}>
                      <p class="menu-description">{item.description}</p>
                    </Show>
                    <p class="menu-price">${Number(item.price).toFixed(2)}</p>
                    <button
                      class="btn btn-primary"
                      onClick={() => addToCart(item.id)}
                      disabled={addingToCart() === item.id}
                    >
                      {addingToCart() === item.id ? "Adding..." : "Add to Cart"}
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>
        </Show>
      </Show>
    </div>
  );
}
