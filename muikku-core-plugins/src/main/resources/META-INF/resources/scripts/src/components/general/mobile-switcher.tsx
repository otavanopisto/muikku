import * as React from 'react';

const MobileSwitcher = (
  MobileComponent: () => JSX.Element,
  DesktopComponent: () => JSX.Element) =>
  ({ isMobile }: { isMobile: boolean }): JSX.Element => {
    return isMobile ?
      <MobileComponent />
      :
      <DesktopComponent />
  }


export default MobileSwitcher;