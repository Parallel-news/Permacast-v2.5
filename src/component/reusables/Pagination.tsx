import { Dispatch, SetStateAction, useState, useEffect } from 'react';
import { convertToValidNumber } from '@/utils/validation/inputs';

import { Icon } from '../icon';
import DebouncedInput from './debouncedInput';

interface PaginationProps {
  totalPages: number;
  // allowed pages to be displayed, best to be around 3-5
  limitPagination: number;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  removeScrollButtons?: boolean;
  buttonStyles?: string;
  extraJSX?: any;
};

const buttonStyling = `pagination-button h-8 w-8 `;


const Pagination = ({
  totalPages,
  limitPagination,
  currentPage,
  setCurrentPage,
  removeScrollButtons,
  buttonStyles,
  extraJSX
}: PaginationProps) => {
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
          <Icon className="h-6 w-6 mr-1" icon="CHEVLEFT" />
        </button>
      )}
      {(totalPages >= limitPagination - 1) && (
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
      {totalPages >= 1 && Array.from(Array(totalPages).keys()).slice(0, limitPagination).map((page: number) => (
        <button
          key={page}
          className={styling}
          onClick={() => setCurrentPage(page + 1)}
          disabled={page === (currentPage - 1)}
        >
          {page + 1}
        </button>
      ))}
      {totalPages >= limitPagination && (
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
          <Icon className="h-6 w-6 mr-1" icon="CHEVRIGHT"/>
        </button>
      )}
      {extraJSX ? extraJSX : ""}
    </div>
  );
};

export default Pagination;