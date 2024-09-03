import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { useForm } from 'react-hook-form';
import DataTable from 'react-data-table-component';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxpayers, setTaxpayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const { register, handleSubmit, reset } = useForm();

  useEffect(() => {
    fetchTaxpayers();
  }, []);

  const fetchTaxpayers = async () => {
    try {
      const result = await backend.getTaxPayers();
      setTaxpayers(result);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching taxpayers:', error);
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const result = await backend.addTaxPayer(data.firstName, data.lastName, data.address);
      if ('ok' in result) {
        console.log('New taxpayer added with TID:', result.ok);
        reset();
        fetchTaxpayers();
      } else {
        console.error('Error adding taxpayer:', result.err);
      }
    } catch (error) {
      console.error('Error adding taxpayer:', error);
    }
    setLoading(false);
  };

  const columns = [
    {
      name: 'TID',
      selector: (row: TaxPayer) => Number(row.tid),
      sortable: true,
    },
    {
      name: 'First Name',
      selector: (row: TaxPayer) => row.firstName,
      sortable: true,
    },
    {
      name: 'Last Name',
      selector: (row: TaxPayer) => row.lastName,
      sortable: true,
    },
    {
      name: 'Address',
      selector: (row: TaxPayer) => row.address,
      sortable: true,
    },
  ];

  return (
    <Container maxWidth="lg" className="py-8">
      <Box className="mb-8">
        <Typography variant="h4" component="h1" gutterBottom>
          TaxPayer Management System
        </Typography>
        <img
          src="https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixid=M3w2MzIxNTd8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MjUzODUzOTl8&ixlib=rb-4.0.3"
          alt="Tax office"
          className="w-full h-48 object-cover rounded-lg mb-4"
        />
        <Typography variant="caption" display="block" gutterBottom>
          Photo by <a href="https://unsplash.com/photos/people-sitting-on-chair-in-front-of-computer-YI_9SivVt_s" target="_blank" rel="noopener noreferrer">Unsplash</a>
        </Typography>
      </Box>

      <Box className="mb-8 p-4 bg-white rounded-lg shadow">
        <Typography variant="h6" gutterBottom>
          Add New TaxPayer
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            {...register('firstName', { required: true })}
            placeholder="First Name"
            className="w-full p-2 border rounded"
          />
          <input
            {...register('lastName', { required: true })}
            placeholder="Last Name"
            className="w-full p-2 border rounded"
          />
          <input
            {...register('address', { required: true })}
            placeholder="Address"
            className="w-full p-2 border rounded"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={loading}
          >
            {loading ? 'Adding...' : 'Add TaxPayer'}
          </button>
        </form>
      </Box>

      <Box className="bg-white rounded-lg shadow">
        <Typography variant="h6" gutterBottom className="p-4">
          TaxPayer Records
        </Typography>
        {loading ? (
          <Box className="flex justify-center items-center h-64">
            <CircularProgress />
          </Box>
        ) : (
          <DataTable
            columns={columns}
            data={taxpayers}
            pagination
            responsive
            highlightOnHover
          />
        )}
      </Box>
    </Container>
  );
};

export default App;
