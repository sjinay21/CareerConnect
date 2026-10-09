import "./globals.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Footer from "@/components/layout/footer";

export const metadata = {
  title: "LinkedIn",
  description: "A professional network clone",
};

import { CustomToaster } from "@/components/ui/toastUtils";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <GoogleOAuthProvider
          clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH_KEY || "dummy"}
        >
          <CustomToaster />
          <div className="bg-white flex flex-col min-h-screen w-full box-border">
            {children}
            <Footer />
          </div>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
