import { PuffLoader } from 'react-spinners';

export function Spinner() {
    return (
        <div className={'w-full h-full flex items-center justify-center'}>
            <PuffLoader
                color={"#FFFFFF"}
                aria-label="Loading Spinner" data-testid="loader" />
        </div>
    );
}
