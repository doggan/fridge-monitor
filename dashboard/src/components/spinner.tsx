import {PuffLoader} from 'react-spinners';
import classNames from "classnames";

interface SpinnerProps {
    className?: string;
}

export function Spinner({ className }: SpinnerProps) {
    return (
        <div className={classNames('w-full h-full flex items-center justify-center', className)}>
            <PuffLoader
                color={"#64748b"}
                aria-label="Loading Spinner" data-testid="loader" />
        </div>
    );
}
