import { Dispatch, FC, SetStateAction, useState, lazy, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { convertToValidNumber } from '../../utils/validation/inputs';

const DebouncedInput = lazy(() => import("../reusables/debouncedInput").then(module => ({ default: module.default })));

interface PaginationProps {
  totalPages: number;
  // allowed pages to be displayed, best to be an odd number
  totalResults: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  removeScrollButtons?: boolean;
  buttonStyles?: string;
  extraJSX?: any;
};

const buttonStyling = `pagination-button h-8 w-8 `;


const Pagination: FC<PaginationProps> = ({
  totalPages,
  totalResults,
  currentPage,
  setCurrentPage,
  removeScrollButtons,
  buttonStyles,
  extraJSX
}) => {
  const [navigatePage, setNavigatePage] = useState<number>(currentPage);
  const styling = buttonStyles ? buttonStyles : buttonStyling;

  useEffect(() => {
    setNavigatePage(currentPage);
  }, [currentPage]);

  return (
    <div className="flexFullCenterGap justify-center">
      {(totalPages >= 1 && !removeScrollButtons) && (
        <button
          className={styling}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeftIcon className="h-6 w-6 mr-1" />
        </button>
      )}
      {(totalPages >= totalResults - 1) && (
        <DebouncedInput
          className={styling + 'text-center font-bold underline '}
          input={navigatePage}
          setInput={setNavigatePage}
          timeout={800}
          callback={(val) => {
            const value = convertToValidNumber(val, 1);
            if (value > 1 && value <= totalPages && value !== currentPage) {
              setCurrentPage(value);
            } else if (value === 1) {
              setCurrentPage(1);
            };
          }}
          placeholder={currentPage.toString()}
        />
      )}
      {totalPages >= 1 && Array.from(Array(totalPages).keys()).slice(0, totalResults).map((page: number) => (
        <button
          key={page}
          className={styling}
          onClick={() => setCurrentPage(page + 1)}
          disabled={page === (currentPage - 1)}
        >
          {page + 1}
        </button>
      ))}
      {totalPages >= totalResults && (
        <button
          className={styling}
          onClick={() => setCurrentPage(totalPages)}
          disabled={totalPages === currentPage}
        >
          {totalPages}
        </button>
      )}
      {(totalPages >= 1 && !removeScrollButtons) && (
        <button
          className={styling}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <ChevronRightIcon className="h-6 w-6 mr-1" />
        </button>
      )}
      {extraJSX ? extraJSX : ""}
    </div>
  );
};

export default Pagination;