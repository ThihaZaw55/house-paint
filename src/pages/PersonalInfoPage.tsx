import { Pencil, User } from "lucide-react";
import UploadPhotoComponent from "../components/commons/UploadPhotoComponent";
import PageTemplate from "../components/commons/PageTemplate";
import Button from "../components/ui/Button";

type Profile = {
  id?: number;
  name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  jobTitle?: string;
  biography?: string;
  statusValue?: string;
  expectedSalaryFrom?: number;
  expectedSalaryTo?: number;
  registeredAt?: string;
  activatedAt?: string;
  profileImage?: string;
};

const profile: Profile = {
  id: 1,
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 555 123 4567",
  dob: "1990-05-10",
  gender: "Male",
  jobTitle: "Frontend Developer",
  biography: "Focused on building clean user experiences with React and TypeScript.",
  statusValue: "Active",
  expectedSalaryFrom: 2500,
  expectedSalaryTo: 3500,
  registeredAt: "2026-08-01T10:00:00Z",
  activatedAt: "2026-08-10T10:00:00Z",
  profileImage: "",
};

export default function PersonalInfoPage() {
  const salary =
    profile.expectedSalaryFrom && profile.expectedSalaryTo
      ? `${profile.expectedSalaryFrom.toLocaleString()} to ${profile.expectedSalaryTo.toLocaleString()}`
      : profile.expectedSalaryFrom
        ? profile.expectedSalaryFrom.toLocaleString()
        : profile.expectedSalaryTo
          ? profile.expectedSalaryTo.toLocaleString()
          : "Undefined";

  return (
    <PageTemplate title="Personal Information">
      <div className="flex flex-col gap-4 md:flex-row">
       

        <section className="flex-1 space-y-4">
          <ProfileImage url={profile.profileImage} />

          <div className="space-y-3">
            <UploadPhotoComponent id={profile.id} />
            <Button type="button" className="w-full" variant="secondary">
              <span className="inline-flex items-center gap-2">
                <Pencil size={16} />
                Edit Information
              </span>
            </Button>
          </div>
        </section>

        <section className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <Information label="Name" value={getValue(profile.name)} />
          <Information label="Date Of Birth" value={getValue(profile.dob)} />
          <Information label="Gender" value={getValue(profile.gender)} />
          <Information label="Phone" value={getValue(profile.phone)} />
          <Information label="Email" value={getValue(profile.email)} />
          <Information label="Job Title" value={getValue(profile.jobTitle)} />
          <Information label="Status" value={getValue(profile.statusValue)} />
          <Information label="Expected Salary" value={getValue(salary)} />
          <Information label="Biography" value={getValue(profile.biography)} className="md:col-span-2 xl:col-span-3" />
          <Information label="Registered At" value={formatDateTime(profile.registeredAt)} />
          <Information label="Verified At" value={formatDateTime(profile.activatedAt)} />
        </section>
      </div>
    </PageTemplate>
  );
}

type InformationProps = {
  label: string;
  value: string;
  className?: string;
};

function Information({ label, value, className = "" }: InformationProps) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white p-4 shadow-sm ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-sm text-slate-800">{value}</p>
    </div>
  );
}

function ProfileImage({ url }: { url?: string }) {
  if (!url) {
    return <ProfileImageDefault />;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      <img src={url} alt="Profile" className="h-60 w-full object-cover" />
    </div>
  );
}

function ProfileImageDefault() {
  return (
    <section className="flex h-60 flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50">
      <User size={120} color="#2A6B5C" />
      <h5 className="text-xl font-semibold text-gray-500">Profile Photo</h5>
    </section>
  );
}

function getValue(value?: string) {
  return value || "Undefined";
}

function formatDateTime(value?: string) {
  if (!value) return "Undefined";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}