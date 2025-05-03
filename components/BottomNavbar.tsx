import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function BottomNavbar() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 px-4 py-3 flex justify-around">
      {/* Checklist Tab */}
      <button className="flex flex-col items-center text-gray-700 hover:text-gray-900">
        <MaterialCommunityIcons
          name="checkbox-marked-outline"
          size={24}
          className="mb-1"
        />
        <span className="text-xs font-medium">Checklist</span>
      </button>

      {/* Templates Tab */}
      <button className="flex flex-col items-center text-gray-700 hover:text-gray-900">
        <MaterialCommunityIcons
          name="clipboard-list-outline"
          size={24}
          className="mb-1"
        />
        <span className="text-xs font-medium">Templates</span>
      </button>
    </nav>
  );
}
