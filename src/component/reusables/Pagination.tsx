import { Dispatch, SetStateAction, useState, useEffect, ReactNode } from 'react';

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
  extraJSX?: ReactNode;
};

const defaultButtonStyling = `pagination-button h-10 w-10 `;

const Pagination = ({
  totalPages,
  limitPagination,
  currentPage,
  setCurrentPage,
  removeScrollButtons,
  buttonStyles = defaultButtonStyling,
  extraJSX
}: PaginationProps) => {

  const handleNavigate = (value: number) => {
    if (value > 1 && value <= totalPages && value !== currentPage) {
      setCurrentPage(value);
    } else if (value === 1) {
      setCurrentPage(1);
    }
  }

  useEffect(() => {
    if (totalPages < currentPage || totalPages === 0) setCurrentPage(totalPages);
  }, [currentPage])

  return (
    <div className="flexFullCenterGap justify-center">
      {(totalPages >= 1 && !removeScrollButtons) && (
        <button
          className={buttonStyles}
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Icon className="h-6 w-6 mr-1" icon="CHEVLEFT" />
        </button>
      )}
      {totalPages >= 1 && Array.from(Array(totalPages).keys()).slice(0, limitPagination).map((page: number) => (
        <button
          key={page}
          className={buttonStyles}
          onClick={() => setCurrentPage(page + 1)}
          disabled={page === (currentPage - 1)}
        >
          {page + 1}
        </button>
      ))}
      {(totalPages > limitPagination + 1) && (
        <DebouncedInput
          className={buttonStyles + 'text-center font-bold '}
          input={currentPage}
          setInput={setCurrentPage}
          timeout={100}
          callback={(val) => handleNavigate(convertToValidNumber(val, 1))}
          placeholder={currentPage.toString()}
        />
      )}
      {totalPages > limitPagination && (
        <button
          className={buttonStyles}
          onClick={() => setCurrentPage(totalPages)}
          disabled={totalPages === currentPage}
        >
          {totalPages}
        </button>
      )}
      {(totalPages >= 1 && !removeScrollButtons) && (
        <button
          className={buttonStyles}
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          <Icon className="h-6 w-6 mr-1" icon="CHEVRIGHT" />
        </button>
      )}
      {extraJSX ? extraJSX : ""}
    </div>
  );
};

export default Pagination;