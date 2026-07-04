import { Link } from 'react-router-dom';

const CODES = {
  400: { title: 'Bad Request',          desc: 'The request could not be understood or was missing required information.' },
  401: { title: 'Unauthorized',         desc: 'You need to sign in to view this page.' },
  403: { title: 'Forbidden',            desc: "You don't have permission to access this resource." },
  404: { title: 'Not Found',            desc: "The page or record you're looking for doesn't exist." },
  500: { title: 'Server Error',         desc: 'Something went wrong on our end. Please try again shortly.' },
  503: { title: 'Service Unavailable',  desc: 'The service is temporarily unavailable. Please try again shortly.' },
  505: { title: 'Not Supported',        desc: 'This request could not be processed.' },
};

export default function ErrorPage({ code = 404, message }) {
  const info = CODES[code] || { title: 'Something went wrong', desc: 'An unexpected error occurred.' };

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-[60px] text-center font-['Roboto']">
      <div className="mb-[10px] font-['Inter'] text-[68px] font-extrabold leading-none text-[#1E3A8A]">
        {code}
      </div>
      <h1 className="mb-[10px] font-['Inter'] text-[22px] font-semibold text-[#1E293B]">
        {info.title}
      </h1>
      <p className="mb-[26px] max-w-[420px] text-[14.5px] leading-[1.6] text-[#64748B]">
        {message || info.desc}
      </p>
      <Link
        to="/"
        className="rounded-lg bg-[#2563EB] px-[22px] py-[10px] text-sm font-semibold text-white no-underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}