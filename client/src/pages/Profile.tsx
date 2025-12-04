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
    <div class="page profile-container">
      <Show when={loading() || dataLoading()}>
        <div class="card" style="text-align: center;">
          <p style="color: var(--color-text-muted);">Loading your profile...</p>
        </div>
      </Show>

      <Show when={!loading() && !dataLoading()}>
        <Show
          when={user()}
          fallback={
            <div class="card" style="text-align: center;">
              <p style="color: var(--color-text-muted);">Please sign in to view your profile.</p>
              <A href="/login" class="btn btn-primary" style="margin-top: var(--space-md);">
                Sign In
              </A>
            </div>
          }
        >
          <div class="profile-header">
            <div class="profile-avatar">{getInitial()}</div>
            <h1 style="color: var(--color-gold); margin-bottom: var(--space-sm);">Your Profile</h1>
            <p style="color: var(--color-text-muted); margin: 0;">Manage your account details</p>
          </div>

          <div class="card" style="max-width: 100%;">
            <div class="booking-info" style="margin-bottom: var(--space-lg);">
              <div class="booking-info-item">
                <span class="booking-info-label">Email Address</span>
                <span class="booking-info-value">{userData()?.email || user()?.email}</span>
              </div>

              <div class="booking-info-item">
                <span class="booking-info-label">Member ID</span>
                <span class="booking-info-value">#{user()?.id}</span>
              </div>

              <div class="booking-info-item">
                <span class="booking-info-label">Member Since</span>
                <span class="booking-info-value">
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

            <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
              <A href="/bookings" class="btn btn-secondary">
                My Reservations
              </A>
              <A href="/orders" class="btn btn-secondary">
                Order History
              </A>
              <A href="/delete" class="btn btn-danger">
                Delete Account
              </A>
            </div>
          </div>
        </Show>
      </Show>
    </div>
  );
}
