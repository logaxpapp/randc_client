// src/pages/wallet/WalletManager.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSpinner, FaWallet, FaArrowCircleUp, FaArrowCircleDown } from 'react-icons/fa';
import { useAppSelector } from '../../app/hooks';

import {
  useGetWalletQuery,
  useGetWalletTransactionsQuery,
  useDepositMutation,
  useWithdrawMutation,
  useCreateStripeDepositSessionMutation, // <-- NEW
} from '../../features/wallet/walletApi';

const WalletManager: React.FC = () => {
  // 1) Get user from Redux
  const user = useAppSelector((state) => state.auth.user);

  // 2) If no user => must log in
  if (!user) {
    return (
      <motion.div
        className="flex justify-center items-center h-screen text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p className="text-xl">Please log in to access your wallet.</p>
      </motion.div>
    );
  }

  // 3) Determine ownerType & ownerId
  const isTenant = user.roles.includes('CLEANER') || user.roles.includes('ADMIN');
  let ownerType: 'TENANT' | 'USER' = 'USER';
  let ownerId = user._id;
  if (isTenant && user.tenant) {
    ownerType = 'TENANT';
    ownerId = user.tenant;
  }

  // 4) State for deposit/withdraw
  const [amount, setAmount] = useState<number>(0);

  // 5) State for transaction filters
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [search, setSearch] = useState<string>('');
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 6) RTK Queries
  const {
    data: wallet,
    isLoading: walletLoading,
    isError: walletError,
    refetch: refetchWallet,
  } = useGetWalletQuery({ ownerType, ownerId });

  const {
    data: transactionsResp,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTx,
  } = useGetWalletTransactionsQuery({
    ownerType,
    ownerId,
    page,
    limit,
    search,
    sortField,
    sortOrder,
  });

  // 7) RTK Mutations
  const [deposit, { isLoading: depositLoading }] = useDepositMutation();
  const [withdraw, { isLoading: withdrawLoading }] = useWithdrawMutation();
  const [
    createStripeDepositSession,
    { isLoading: stripeDepositLoading },
  ] = useCreateStripeDepositSessionMutation();

  // 8) Handlers

  // manual deposit
  const handleDeposit = async () => {
    if (amount <= 0) return alert('Enter a positive amount');
    try {
      const resp = await deposit({ ownerType, ownerId, amount }).unwrap();
      if (resp.success) {
        alert(`Deposit success! New balance = ${resp.data?.balance}`);
        refetchWallet();
        refetchTx();
      } else {
        alert(resp.message || 'Deposit failed');
      }
    } catch (err: any) {
      alert(err?.data?.message || 'Deposit error');
    }
  };

  // manual withdraw
  const handleWithdraw = async () => {
    if (amount <= 0) return alert('Enter a positive amount');
    try {
      const resp = await withdraw({ ownerType, ownerId, amount }).unwrap();
      if (resp.success) {
        alert(`Withdraw success! New balance = ${resp.data?.balance}`);
        refetchWallet();
        refetchTx();
      } else {
        alert(resp.message || 'Withdraw failed');
      }
    } catch (err: any) {
      alert(err?.data?.message || 'Withdraw error');
    }
  };

  // stripe deposit
  const handleStripeDeposit = async () => {
    if (amount <= 0) return alert('Enter a positive deposit amount');
    try {
      const resp = await createStripeDepositSession({ ownerType, ownerId, amount }).unwrap();
      if (resp.success && resp.url) {
        // Redirect to Stripe Checkout
        window.location.href = resp.url;
      } else {
        alert('Failed to create Stripe deposit session');
      }
    } catch (err: any) {
      alert(err?.data?.message || 'Stripe deposit error');
    }
  };
  
  // pagination
  const handleNextPage = () => {
    if (transactionsResp?.meta && page < transactionsResp.meta.totalPages) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };

  // 9) Loading / error states
  if (walletLoading || txLoading) {
    return (
      <motion.div
        className="p-4 flex items-center justify-center text-gray-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <FaSpinner className="animate-spin mr-2" />
        Loading wallet data...
      </motion.div>
    );
  }
  if (walletError) {
    return (
      <motion.div
        className="p-4 text-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>Failed to load wallet.</p>
        <button onClick={() => refetchWallet()} className="underline">
          Retry
        </button>
      </motion.div>
    );
  }
  if (txError) {
    return (
      <motion.div
        className="p-4 text-red-600"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>Failed to load transactions.</p>
        <button onClick={() => refetchTx()} className="underline">
          Retry
        </button>
      </motion.div>
    );
  }

  // 10) Main UI
  const transactions = transactionsResp?.data || [];
  const meta = transactionsResp?.meta;

  return (
    <section className="relative w-full min-h-screen overflow-hidden text-gray-800">
      <header className="sticky top-0 z-20 bg-yellow-200 text-yellow-800 p-1 shadow-md mb-4">
        <strong>Vital Message:</strong> Manage your wallet here.
      </header>

     <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-lime-100 z-0" />


      {/* Bottom Wave */}
      <div className="absolute bottom-0 w-full leading-none z-0">
        <svg
          className="block w-full h-20 md:h-32 lg:h-48"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            fill="#3b82f6"
            fillOpacity="1"
            d="M0,64L48,64C96,64,192,64,288,90.7C384,117,480,171,576,160C672,149,768,75,864,53.3C960,32,1056,64,1152,74.7C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto p-4 space-y-4">
        <motion.div
          className="mx-auto p-4 space-y-6 bg-gray-50 rounded-md shadow-md mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center space-x-3 mb-2">
            <FaWallet className="text-blue-600 text-2xl" />
            <h1 className="text-2xl font-bold text-gray-800">My Wallet</h1>
          </div>

          {/* Wallet info */}
          <AnimatePresence>
            {wallet && (
              <motion.div
                className="bg-white p-4 rounded shadow-md border-l-4 border-amber-400"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-lg font-semibold text-gray-700 mb-2">Wallet Info</h2>
                <p className="text-base text-gray-600">
                  Balance:{' '}
                  <span className="text-xl text-blue-700 font-bold">
                    ${wallet.balance?.toFixed(2)}
                  </span>
                </p>

                {/* If tenant */}
                {wallet.ownerType === 'TENANT' && wallet.owner && (
                  <div className="mt-3 text-gray-700">
                    <p className="font-medium">
                      Tenant Name:{' '}
                      <span className="font-normal">{(wallet.owner as any).name}</span>
                    </p>
                    <p className="font-medium">
                      Domain:{' '}
                      <span className="font-normal">{(wallet.owner as any).domain}</span>
                    </p>
                  </div>
                )}

                {/* If user */}
                {wallet.ownerType === 'USER' && wallet.owner && (
                  <div className="mt-3 text-gray-700">
                    <p className="font-medium">
                      User Name:{' '}
                      <span className="font-normal">
                        {(wallet.owner as any).firstName} {(wallet.owner as any).lastName}
                      </span>
                    </p>
                    <p className="font-medium">
                      Email: <span className="font-normal">{(wallet.owner as any).email}</span>
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Deposit / Withdraw */}
          <motion.div
            className="bg-white p-4 rounded shadow-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label className="block text-gray-700 text-sm font-semibold mb-1">
              Amount (USD)
            </label>
            <input
              type="number"
              className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
            />

            <div className="flex mt-4 flex-wrap gap-3">
              {/* Manual Deposit */}
              <motion.button
                onClick={handleDeposit}
                disabled={depositLoading}
                className="px-5 py-2 flex items-center justify-center bg-green-600 text-white rounded-md shadow-sm hover:bg-green-700 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                {depositLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Depositing...
                  </>
                ) : (
                  <>
                    <FaArrowCircleUp className="mr-2" />
                    Manual Deposit
                  </>
                )}
              </motion.button>

              {/* Stripe Deposit */}
              <motion.button
                onClick={handleStripeDeposit}
                disabled={stripeDepositLoading}
                className="px-5 py-2 flex items-center justify-center bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                {stripeDepositLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Creating Session...
                  </>
                ) : (
                  <>
                    <FaArrowCircleUp className="mr-2" />
                    Deposit with Stripe
                  </>
                )}
              </motion.button>

              {/* Manual Withdraw */}
              <motion.button
                onClick={handleWithdraw}
                disabled={withdrawLoading}
                className="px-5 py-2 flex items-center justify-center bg-red-600 text-white rounded-md shadow-sm hover:bg-red-700 disabled:opacity-50"
                whileTap={{ scale: 0.95 }}
              >
                {withdrawLoading ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" />
                    Withdrawing...
                  </>
                ) : (
                  <>
                    <FaArrowCircleDown className="mr-2" />
                    Withdraw
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Transaction Filters */}
          <motion.div
            className="bg-white p-4 rounded shadow-md"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-md font-semibold text-gray-700 mb-2">
              Filters & Sorting
            </h2>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
              {/* Search */}
              <div className="flex-1">
                <label className="block text-gray-700 text-sm font-semibold">
                  Search
                </label>
                <input
                  type="text"
                  className="border px-3 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Type or description..."
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                />
              </div>

              {/* Sort Field */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold">
                  Sort By
                </label>
                <select
                  className="border px-3 py-2 rounded w-full focus:outline-none"
                  value={sortField}
                  onChange={(e) => {
                    setPage(1);
                    setSortField(e.target.value);
                  }}
                >
                  <option value="createdAt">Date</option>
                  <option value="amount">Amount</option>
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold">
                  Order
                </label>
                <select
                  className="border px-3 py-2 rounded w-full focus:outline-none"
                  value={sortOrder}
                  onChange={(e) => {
                    setPage(1);
                    setSortOrder(e.target.value as 'asc' | 'desc');
                  }}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </select>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold">
                  Page Size
                </label>
                <select
                  className="border px-3 py-2 rounded w-full focus:outline-none"
                  value={limit}
                  onChange={(e) => {
                    setPage(1);
                    setLimit(Number(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                </select>
              </div>
            </div>
          </motion.div>

          {/* Transaction List */}
          <motion.div
            className="bg-white p-4 rounded shadow-md"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-lg font-semibold text-gray-700 mb-2">
              Transaction History
            </h2>
            {transactions.length === 0 ? (
              <p className="text-gray-400">No transactions found.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {transactions.map((tx) => (
                  <motion.li
                    key={tx._id}
                    className="py-2 flex justify-between items-center text-gray-600"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <span>
                      <span className="font-medium">
                        {tx.type === 'DEPOSIT' ? 'Deposit' : 'Withdrawal'}
                      </span>{' '}
                      of ${tx.amount}
                      {tx.description ? ` - ${tx.description}` : ''}
                    </span>
                    <span className="text-sm text-gray-500">
                      {new Date(tx.createdAt).toLocaleString()}
                    </span>
                  </motion.li>
                ))}
              </ul>
            )}

            {/* Pagination Controls */}
            {meta && (
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
                >
                  Previous
                </button>
                <p className="text-sm text-gray-600">
                  Page {meta.page} of {meta.totalPages} (Total: {meta.total})
                </p>
                <button
                  onClick={handleNextPage}
                  disabled={page >= meta.totalPages}
                  className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50 hover:bg-gray-400"
                >
                  Next
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default WalletManager;
