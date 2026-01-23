import GrailedLayout from "@/components/GrailedLayout";

const ProfilePage = () => {
  return (
    <GrailedLayout>
      <div className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences.
            </p>
          </div>
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="text-muted-foreground">Your profile settings and account details will appear here.</p>
          </div>
        </div>
      </div>
    </GrailedLayout>
  );
};

export default ProfilePage;
