import { Markup } from 'interweave';
import React from 'react';
import { AnswerTypeEnum } from '../../enums/exams';
import { Checkbox, Radio } from 'antd';
import {
  CloseOutlined,
  CheckOutlined,
} from '@ant-design/icons';

type QuesionDataProps = {
  questionData: any
  examStatus: any
  answerList: any
  setAnswerList: (newAnswer: any) => void
}

function QuesionData({questionData, examStatus, answerList, setAnswerList}: QuesionDataProps) {
  return (
    <div className='mt-[24px] flex flex-col justify-start items-start'>
      {questionData?.map(
        (item: any, index: number) => {
          return (
            <div key={`question-${index}-${item?._id}`} className='mt-[20px]'>
              <p className='font-bold text-lg text-left'>
                Câu hỏi {index + 1}:
              </p>
              <div className='question-content mb-[10px]'>
                <Markup content={item?.question || ''} />
              </div>

              <div className='flex flex-col justify-start items-start'>
                {item?.answerList?.map((answerItem: any, answerIndex: any) => {
                  return item.answerType === AnswerTypeEnum.CHECKOX ? (
                    examStatus === 'RESULT' ? (
                      <Checkbox
                        disabled={true}
                        checked={answerList[item?._id]?.includes(
                          answerItem?._id
                        )}
                      >
                        <p className='text-base'>
                          {answerItem?.answer}

                          <span className='ml-[10px]'>
                            {answerItem?.isTrue ? (
                              <CheckOutlined className='text-[green]' />
                            ) : (
                              <></>
                            )}
                            {answerList[item?._id]?.includes(answerItem?._id) &&
                            !answerItem?.isTrue ? (
                              <CloseOutlined className='text-[red]' />
                            ) : (
                              <></>
                            )}
                          </span>
                        </p>
                      </Checkbox>
                    ) : (
                      <Checkbox
                        key={`answer-${answerIndex}-${answerItem?._id}`}
                        onChange={(event) => {
                          const newAnswerList = JSON.parse(
                            JSON.stringify(answerList)
                          );

                          if (event.target.checked) {
                            if (
                              newAnswerList[item?._id] &&
                              newAnswerList[item?._id]?.length
                            ) {
                              const data = [...newAnswerList[item?._id]];
                              data.push(answerItem?._id);
                              newAnswerList[item._id] = [...data];
                            } else {
                              newAnswerList[item._id] = [answerItem?._id];
                            }
                          } else {
                            const data = [...newAnswerList[item?._id]]?.filter(
                              (it) => it !== answerItem?._id
                            );

                            if (data?.length) {
                              newAnswerList[item._id] = [...data];
                            } else {
                              delete newAnswerList[item._id];
                            }
                          }

                          setAnswerList(newAnswerList);
                        }}
                        checked={answerList[item?._id]?.includes(
                          answerItem?._id
                        )}
                      >
                        <p className='text-base'>{answerItem?.answer}</p>
                      </Checkbox>
                    )
                  ) : examStatus === 'RESULT' ? (
                    <Radio
                      disabled={true}
                      checked={answerList[item?._id]?.includes(answerItem?._id)}
                    >
                      <p className='text-base'>
                        {answerItem?.answer}

                        <span className='ml-[10px]'>
                          {answerItem?.isTrue ? (
                            <CheckOutlined className='text-[green]' />
                          ) : (
                            <></>
                          )}
                          {answerList[item?._id]?.includes(answerItem?._id) &&
                          !answerItem?.isTrue ? (
                            <CloseOutlined className='text-[red]' />
                          ) : (
                            <></>
                          )}
                        </span>
                      </p>
                    </Radio>
                  ) : (
                    <Radio
                      checked={answerList[item?._id]?.includes(answerItem?._id)}
                      key={`radio-${answerIndex}-${answerItem?._id}`}
                      onChange={(event) => {
                        const newAnswerList = JSON.parse(
                          JSON.stringify(answerList)
                        );

                        if (
                          newAnswerList[item?._id] &&
                          newAnswerList[item?._id]?.length
                        ) {
                          delete newAnswerList[item?._id];
                        }

                        if (event.target.checked) {
                          if (
                            newAnswerList[item?._id] &&
                            newAnswerList[item?._id]?.length
                          ) {
                            const data = [...newAnswerList[item?._id]];
                            data.push(answerItem?._id);
                            newAnswerList[item._id] = [...data];
                          } else {
                            newAnswerList[item._id] = [answerItem?._id];
                          }
                        } else {
                          const data = [...newAnswerList[item?._id]]?.filter(
                            (it) => it !== answerItem?._id
                          );

                          if (data?.length) {
                            newAnswerList[item._id] = [...data];
                          } else {
                            delete newAnswerList[item._id];
                          }
                        }
                        setAnswerList(newAnswerList);
                      }}
                    >
                      <p className='text-base'>{answerItem?.answer}</p>
                    </Radio>
                  );
                })}
              </div>
            </div>
          );
        }
      )}
    </div>
  );
}

export default QuesionData;
