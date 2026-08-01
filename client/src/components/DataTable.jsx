import React, { useState, useMemo } from 'react';
import { FaSearch, FaChevronLeft, FaChevronRight, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import LoadingSpinner from './LoadingSpinner';

const DataTable = ({ columns, data = [], loading = false, searchable = true, pageSize = 10, onRowClick, actions }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter(row => columns.some(col => {
      const val = col.accessor ? row[col.accessor] : '';
      return String(val).toLowerCase().includes(searchTerm.toLowerCase());
    }));
  }, [data, searchTerm, columns]);

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortConfig.key], bVal = b[sortConfig.key];
      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig]);

  const totalPages = Math.ceil(sortedData.length / pageSize);
  const paginatedData = sortedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSort = (key) => {
    setSortConfig(prev => ({ key, direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc' }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="h-3 w-3" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="h-3 w-3" /> : <FaSortDown className="h-3 w-3" />;
  };

  if (loading) return <LoadingSpinner message="Loading data..." />;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-card overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input type="text" placeholder="Search..." value={searchTerm} onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent" />
          </div>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              {columns.map(col => (
                <th key={col.accessor || col.header} className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => col.accessor && handleSort(col.accessor)}>
                  <div className="flex items-center space-x-1"><span>{col.header}</span>{col.accessor && getSortIcon(col.accessor)}</div>
                </th>
              ))}
              {actions && <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedData.length === 0 ? (
              <tr><td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">No data found</td></tr>
            ) : paginatedData.map((row, i) => (
              <tr key={row.id || row._id || i} className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                onClick={() => onRowClick && onRowClick(row)}>
                {columns.map(col => (
                  <td key={col.accessor || col.header} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {col.render ? col.render(row[col.accessor], row) : row[col.accessor]}
                  </td>
                ))}
                {actions && <td className="px-6 py-4 whitespace-nowrap text-sm"><div className="flex items-center space-x-2">{actions(row)}</div></td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-300">Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}</p>
          <div className="flex items-center space-x-2">
            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><FaChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let page = totalPages <= 5 ? i + 1 : currentPage <= 3 ? i + 1 : currentPage >= totalPages - 2 ? totalPages - 4 + i : currentPage - 2 + i;
              return <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${currentPage === page ? 'bg-primary-800 text-white' : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>{page}</button>;
            })}
            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"><FaChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
