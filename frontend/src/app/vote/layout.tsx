import type { Metadata } from "next";
import "../globals.css";
import { ReactNode } from "react"
import Header from "@/components/Header"


export const metadata: Metadata = {
  title: "TrustPoll",
};

export default function VoteLayout(props: {
  children: ReactNode}){
  return (
    <html lang="en">
      <body>
          <Header />
          {props.children}
      </body>
    </html>
  );
}