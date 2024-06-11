import { Button, DatePicker, message } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { examResultAPI } from '../../../services/exam-result';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const { RangePicker } = DatePicker;
ChartJS.register(ArcElement, Tooltip, Legend);

export const AdminDashboard = () => {
  const [timeRange, setTimeRage] = useState<any>([
    dayjs(dayjs().subtract(1, 'week').format('YYYY-MM-DD'), 'YYYY-MM-DD'),
    dayjs(dayjs().format('YYYY-MM-DD'), 'YYYY-MM-DD'),
  ]);
  const [statisticData, setStatisticData] = useState<any>({});
  const [chartData, setChartData] = useState<any>(null);

  const searchExamResultByDate = async () => {
    try {
      const startDate = timeRange[0]
        .startOf('day')
        .format('YYYY-MM-DD HH:mm:ss');
      const endDate = timeRange[1].endOf('day').format('YYYY-MM-DD HH:mm:ss');

      const res = await examResultAPI.statisticExamResult(startDate, endDate);

      if (res?.data?.payload) {
        setStatisticData(res?.data?.payload);
        setChartData({
          labels: ['Dưới trung bình', 'Trên trung bình'],
          datasets: [
            {
              label: 'Số lượng',
              data: [
                res?.data?.payload?.belowAverage,
                res?.data?.payload?.aboveAverage,
              ],
              backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)'],
              hoverOffset: 4,
            },
          ],
        });
      }
    } catch (error) {
      message.error('Lấy thông tin thất bại');
    }
  };

  useEffect(() => {
    searchExamResultByDate();
  }, []);

  return (
    <div>
      <div className='border-b-[2px] border-b-solid border-b-[#6aa84f] w-fit pr-[10px] text-2xl font-bold'>
        Thống kê sinh viên tham gia thi
      </div>

      <div className='mt-[20px] flex'>
        <RangePicker
          value={timeRange}
          onChange={(dateRage) => setTimeRage(dateRage)}
        />
        <Button
          className='bg-[#6aa84f] text-white ml-[20px]'
          onClick={() => searchExamResultByDate()}
        >
          Tìm kiếm
        </Button>
      </div>

      <div className='flex justify-center mt-[50px]'>
        {chartData ? (
          <div className='w-[100%] md:w-[30%]'>
            {' '}
            <Doughnut data={chartData} />
          </div>
        ) : (
          <></>
        )}
      </div>

      <div className='flex items-center justify-center mt-[50px] gap-x-[100px] flex-wrap gap-y-[20px] mb-[50px]'>
        <div className='bg-[#6aa84f] py-[30px] px-[75px] rounded-[16px]'>
          <p className='text-xl font-bold text-center text-white'>
            Tổng số sinh viên
          </p>
          <p className='text-[white] text-lg font-bold text-center'>
            {statisticData?.totalStudent || 0}
          </p>
        </div>

        <div className='bg-[#6aa84f] py-[30px] px-[50px] rounded-[16px]'>
          <p className='text-xl font-bold text-center text-white'>
            Bài thi dưới trung bình
          </p>
          <p className='text-[white] text-lg font-bold text-center'>
            {statisticData?.belowAverage || 0}
          </p>
        </div>

        <div className='bg-[#6aa84f] py-[30px] px-[50px] rounded-[16px]'>
          <p className='text-xl font-bold text-center  text-white'>
            Bài thi trên trung bình
          </p>
          <p className='text-[white] text-lg font-bold text-center'>
            {statisticData?.aboveAverage || 0}
          </p>
        </div>
      </div>
    </div>
  );
};
