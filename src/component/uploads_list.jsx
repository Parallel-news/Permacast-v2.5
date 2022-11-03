// @flow 
import * as React from 'react';
import { useRecoilValue } from 'recoil';
import { uploadPercent } from '../atoms';

export const UploadsList = (props) => {
    const { t } = props;
    const percent = useRecoilValue(uploadPercent);

    const color = percent >= 75 ? " bg-green-900" : percent >= 50 ? " bg-teal-900" : " bg-blue-900";


    return (
        <div>
            {
                (percent >= 1) ?
                    <div className="mb-4 w-full md:w-1/2">

                        <h1 className="text-2xl tracking-wider text-white">{t("uploadshow.uploadstitle")}</h1>
                        <div className="block px-2 md:px-[8px] my-2 py-2 md:py-[8px] text-xs md:text-base w-full h-11 rounded-full bg-zinc-900 text-zinc-100 outline-none">
                            <div className={"flex text-xs md:text-base h-7 rounded-full bg-green-900 text-zinc-100 outline-none" + color} style={{ width: `${percent}%`}}>
                                <div className="flex flex-row w-full my-auto px-2">
                                    <p className="mx-auto truncate">A Decentland Part 3</p>
                                    <p className="mx-auto">{percent}%</p>
                                </div>
                            </div>
                        </div>
                    </div> :
                    <></>
            }
        </div>
    );
};