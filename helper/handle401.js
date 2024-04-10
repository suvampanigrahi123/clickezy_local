import { toast } from 'react-hot-toast';
import { COMMON } from '../constants/const';
export const handle401 = (error, type) => {
  const handleOk = () => {
    window.location.href = '/login';
    toast.dismiss();
  };

  // trigger handle ok funtion after 1 sec
  setTimeout(handleOk, 1000);
  try {
    switch (type) {
      case 'custom':
        toast.custom(
          (t) => (
            <div className="max-w-md w-full  bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-white ring-opacity-5">
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="ml-3 flex-1">
                    <p className="text-md font-medium text-red-400">
                      Your session has expired,
                    </p>
                    <p className="mt-1 text-sm text-gray-100">
                      Please log in again
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={handleOk}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-md font-medium text-indigo-300 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Login
                </button>
              </div>
            </div>
          ),
          {
            duration: 2000,
            id: 'custom-swaha',
            position: 'top-center',
            style: {
              border: '1px solid #713200',
              padding: '16px',
              color: '#713200',
              animation: 'fadeIn ease 1s',
              transition: 'all 0.2s',
            },
          }
        );
        break;
      default:
        if (
          error.response.status === 401 ||
          error.response?.data?.message.toLowerCase() === 'unauthorized'
        ) {
          localStorage.removeItem(COMMON.AUTH_TOKEN);
          localStorage.removeItem(COMMON.USER);
        }
    }
  } catch (error) {
    console.log(error);
  }
};
