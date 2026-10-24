import { registerAction } from '@/lib/auth-actions';
import { AuthFrame } from '@/components/auth/auth-frame';
import { ArrowRight } from '@/components/marketing/icons';

const ERROR_MESSAGES: Record<string, string> = {
  'email-taken': 'That email is already registered. Try signing in instead.',
  'weak-password': 'Use a password of at least 8 characters.',
  'api-unreachable': 'Could not reach the Control API. Make sure it is running.',
  'invalid-response': 'Unexpected response from the Control API.',
};

interface RegisterPageProps {
  searchParams?: { error?: string | string[] };
}

export default function RegisterPage({ searchParams }: RegisterPageProps) {
  const raw = Array.isArray(searchParams?.error) ? searchParams?.error[0] : searchParams?.error;
  const errorMessage = raw ? (ERROR_MESSAGES[raw] ?? 'Registration failed.') : null;

  return (
    <AuthFrame mode="register">
      {errorMessage ? (
        <p role="alert" className="mb-5 rounded-xl border border-danger-border bg-danger-soft px-4 py-3 text-[13px] leading-relaxed text-danger-dark">
          {errorMessage}
        </p>
      ) : null}
      <form action={registerAction} className="space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[12px] font-semibold text-[#37332E]">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            required
            className="h-[50px] w-full rounded-xl border border-[#E6DED4] bg-[#FFFEFC] px-4 text-[14px] text-ink shadow-[inset_0_1px_2px_rgba(49,38,27,0.025)] placeholder:text-[#AAA197] transition-[border-color,box-shadow] hover:border-[#D9C7B5] focus:border-ember focus:outline-none focus:ring-4 focus:ring-ember/10"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="block text-[12px] font-semibold text-[#37332E]">Create a password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
            className="h-[50px] w-full rounded-xl border border-[#E6DED4] bg-[#FFFEFC] px-4 text-[14px] text-ink shadow-[inset_0_1px_2px_rgba(49,38,27,0.025)] transition-[border-color,box-shadow] hover:border-[#D9C7B5] focus:border-ember focus:outline-none focus:ring-4 focus:ring-ember/10"
          />
          <p className="flex items-center gap-2 text-[11px] text-[#82796F]"><span aria-hidden className="h-1 w-1 rounded-full bg-[#C8784E]" />At least 8 characters</p>
        </div>
        <button type="submit" className="group inline-flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#C94F16] px-5 text-[13px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(168,61,16,0.8)] transition-[transform,background-color,box-shadow] hover:-translate-y-0.5 hover:bg-[#A83D10] hover:shadow-[0_12px_24px_-12px_rgba(168,61,16,0.85)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-ember active:translate-y-0">
          Create your workspace
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </form>
    </AuthFrame>
  );
}
