import './GlobalStyles.scss';
import React, { ReactNode } from 'react';

const GlobalStyles: React.FC<{children:ReactNode}>= ({children}) => {
    return <>{children}</>
}

export default GlobalStyles;