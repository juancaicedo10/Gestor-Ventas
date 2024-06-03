import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

interface PaginationButtonsProps {
    page: number;
  }
  
  export default function PaginationButtons({ page  } : PaginationButtonsProps) {
    return (
      <Pagination count={10} page={page} />
    );
  }
