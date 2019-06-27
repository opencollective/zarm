import React from 'react';

const SvgBrush = props => (
  <svg
    className="brush_svg__icon"
    viewBox="0 0 1024 1024"
    fill="currentColor"
    stroke="currentColor"
    width="1em"
    height="1em"
    {...props}
  >
    <defs>
      <style />
    </defs>
    <path d="M766.88 435.264l-176.608-176.64 66.72-66.752 176.544 176.704-66.656 66.688zM401.44 800.96l-176.8-176.768.256.064 320.128-320.352 176.64 176.64L401.376 800.96zm-177.44.96v-87.872l87.712 87.68-87.68.192zm655.04-478.528L702.272 146.656A60.96 60.96 0 0 0 656.96 128a63.968 63.968 0 0 0-45.12 18.848l-432.256 432.16a63.936 63.936 0 0 0-17.92 54.368c-.768 2.688-1.696 5.312-1.696 8.256V801.92c0 35.136 28.576 63.68 63.712 63.68H384c2.88 0 5.504-.896 8.192-1.632 2.976.416 5.952.832 8.96.832 16.416 0 32.896-6.272 45.44-18.816l432.16-432.16a64 64 0 0 0 .224-90.432z" />
  </svg>
);

export default SvgBrush;
