import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// Since we have a `[locale]` dynamic segment, a top-level Layout is required
// but next-intl redirects from root, so this layout can just render children.
export default function RootLayout({ children }: Props) {
  return children;
}
