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

  const getInitial = () => {
    const email = userData()?.email || user()?.email || "";
    return email.charAt(0).toUpperCase();
  };

  return (
    <div>
      <Show when={loading() || dataLoading()}>
        <div>
          <p>Loading your profile...</p>
        </div>
      </Show>

      <Show when={!loading() && !dataLoading()}>
        <Show
          when={user()}
          fallback={
            <div class="empty-state">
              <p>Please sign in to view your profile.</p>
              <A href="/login" class="btn-primary">
                Sign In
              </A>
            </div>
          }
        >
          <div class="profile-header">
            <div class="profile-avatar">{getInitial()}</div>
            <h1>Your Profile</h1>
            <p>Manage your account details</p>
          </div>

          <div class="profile-content">
            <div class="profile-details">
              <div class="profile-field">
                <span class="profile-label">Email Address</span>
                <span class="profile-value">{userData()?.email || user()?.email}</span>
              </div>

              <div class="profile-field">
                <span class="profile-label">Member ID</span>
                <span class="profile-value">#{user()?.id}</span>
              </div>

              <div class="profile-field">
                <span class="profile-label">Member Since</span>
                <span class="profile-value">
                  {userData()?.created_at
                    ? new Date(userData().created_at).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "N/A"}
                </span>
              </div>
            </div>

            <div class="profile-actions">
              <A href="/bookings" class="profile-btn">
                My Reservations
              </A>
              <A href="/orders" class="profile-btn">
                Order History
              </A>
              <A href="/delete" class="profile-btn profile-btn-danger">
                Delete Account
              </A>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
