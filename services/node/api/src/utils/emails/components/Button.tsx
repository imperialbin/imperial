import React from "react";

interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href: string;
  children: React.ReactNode | React.ReactNode[];
}

export default function Button({ children, href, ...props }: IButtonProps) {
  return (
    <a className="block mt-5" href={href}>
      <button
        className="rounded-md bg-brand outline-none text-white py-[8px] px-[12px] font-medium cursor-pointer border-none"
        {...props}
      >
        {children}
      </button>
    </a>
  );
}
