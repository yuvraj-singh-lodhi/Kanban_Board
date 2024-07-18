import React, { useState } from 'react';
import './App.css';
import KanbanBoard from './component/KanbanBoard';
import Navbar from './component/Navbar';
import Login from './component/Login';
import SignUp from './component/Signup';

function App() {
  const [currentComponent, setCurrentComponent] = useState('kanban');

  const handleLoginClick = () => {
    setCurrentComponent('login');
  };

  const handleSignUpClick = () => {
    setCurrentComponent('signup');
  };

  const handleKanbanClick = () => {
    setCurrentComponent('kanban');
  };

  const renderComponent = () => {
    switch (currentComponent) {
      case 'login':
        return <Login onLogin={function (): void {
          throw new Error('Function not implemented.');
        } } />;
      case 'signup':
        return <SignUp />;
      default:
        return <KanbanBoard />;
    }
  };

  return (
    <>
      <Navbar onLoginClick={handleLoginClick} onSignUpClick={handleSignUpClick} onKanbanClick={handleKanbanClick} />
      {renderComponent()}
    </>
  );
}

export default App;
