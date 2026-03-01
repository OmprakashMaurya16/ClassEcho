import React from "react";
import { GraduationCap } from "lucide-react";

const LogoHeader = () => (
  <div className="flex flex-col items-center mb-4">
    <div className="bg-blue-100 rounded-xl p-2.5 mb-2">
      <GraduationCap size={26} color="blue" />
    </div>
    <h1 className="text-xl font-semibold text-gray-800">
      Vidyalankar Institute of Technology
    </h1>
    <p className="text-gray-500 text-sm">Feedback Portal System</p>
  </div>
);

export default LogoHeader;
