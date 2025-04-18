import * as React from "react";
import { Button as AntdButton, ButtonProps } from "antd";
import cn from "classnames";

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, size, ...props }, ref) => {
    return <AntdButton {...props} ref={ref} className={cn(className)} />;
  }
);
Button.displayName = "Button";

export default Button;
