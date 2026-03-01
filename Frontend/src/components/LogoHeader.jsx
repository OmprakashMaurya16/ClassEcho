import React from "react";
import { GraduationCap } from "lucide-react";

const LogoHeader = () => (
  <div className="flex flex-col items-center mb-6">
    <div className="bg-blue-100 rounded-xl p-3 mb-3">
      <GraduationCap size={30} color="blue" />
    </div>
    <h1 className="text-2xl font-semibold text-gray-800">
      Vidyalankar Institute of Technology
    </h1>
    <p className="text-gray-500 text-sm">Feedback Portal System</p>
  </div>
);

export default LogoHeader;
