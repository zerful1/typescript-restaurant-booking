import { createSignal, onMount, Show } from "solid-js";
import { A } from "@solidjs/router";
import { useAuth } from "../contexts/AuthContext";
import { useFlash } from "../contexts/FlashContext";

export default function Profile() {
  const { user, loading } = useAuth();
  const { setFlash } = useFlash();

  const [userData, setUserData] = createSignal<any>(null);
  const [dataLoading, setDataLoading] = createSignal(true);

  onMount(async () => {
    if (user()) {
      try {
        const response = await fetch("/api/userdata", {
          method: "POST",
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          setFlash("Failed to load profile data", "error");
        }
      } catch (error) {
        setFlash("Error loading profile", "error");
      } finally {
        setDataLoading(false);
      }
    } else {
      setDataLoading(false);
    }
  });

  return (
    <div class="page">
      <div class="card">
        <h1>My Profile</h1>

        <Show when={loading() || dataLoading()}>
          <p>Loading...</p>
        </Show>

        <Show when={!loading() && !dataLoading()}>
          <Show when={user()} fallback={<p>Please log in to view your profile.</p>}>
            <div class="profile-info">
              <div class="profile-field">
                <label>Email:</label>
                <span>{userData()?.email || user()?.email}</span>
              </div>

              <div class="profile-field">
                <label>User ID:</label>
                <span>{user()?.id}</span>
              </div>

              <div class="profile-field">
                <label>Account Created:</label>
                <span>
                  {userData()?.created_at
                    ? new Date(userData().created_at).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div class="profile-actions">
              <A href="/bookings" class="btn btn-secondary">
                View My Bookings
              </A>
              <A href="/delete" class="btn btn-danger">
                Delete Account
              </A>
            </div>
          </Show>
        </Show>
      </div>
    </div>
  );
}
