import React from 'react';

interface NavbarProps {
  onLoginClick: () => void;
  onSignUpClick: () => void;
  onKanbanClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onLoginClick, onSignUpClick, onKanbanClick }) => {
  return (
    <nav className="
      bg-mainBackgroundColor
      text-white
      shadow-md
      flex
      justify-between
      items-center
      px-4
      py-2
    ">
      <div className="flex items-center">
        <h1 className="text-xl font-bold cursor-pointer" onClick={onKanbanClick}>Kanban Board</h1>
      </div>
      <div className="flex gap-4">
        <button
          onClick={onLoginClick}
          className="
            h-[40px]
            w-[80px]
            min-w-[80px]
            cursor-pointer
            rounded-lg
            bg-columnBackgroundColor
            border-2
            border-columnBackgroundColor
            p-2
            hover:bg-opacity-80
            flex
            items-center
            justify-center
          "
        >
          Login
        </button>
        <button
          onClick={onSignUpClick}
          className="
            h-[40px]
            w-[80px]
            min-w-[80px]
            cursor-pointer
            rounded-lg
            bg-columnBackgroundColor
            border-2
            border-columnBackgroundColor
            p-2
            hover:bg-opacity-80
            flex
            items-center
            justify-center
          "
        >
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
