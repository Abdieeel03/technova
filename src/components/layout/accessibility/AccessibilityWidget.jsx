import { useState } from 'react';
import AccessibilityButton from "./AccessibilityButton";
import AccessibilitySidebar from "./AccessibilitySidebar";

export default function AccessibilityWidget({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <AccessibilityButton onClick={toggleSidebar} />

      <AccessibilitySidebar isOpen={isSidebarOpen} onClose={closeSidebar}>
        {children}
      </AccessibilitySidebar>
    </>
  );
}
