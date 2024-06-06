import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationButtonsProps {
    page: number;
  }
  
  export default function PaginationButtons({ page  } : PaginationButtonsProps) {
    return (
      <div className='w-full flex justify-center my-2'>
        <Pagination count={10} page={page} />
      </div>
    );
  }
