

import React from 'react';
//Need Icons? https://github.com/tailwindlabs/heroicons/blob/master/src/

const icons = {
    "ARROWSMALLRIGHT": ["M5 10C5 9.58579 5.33579 9.25 5.75 9.25H12.3879L10.2302 7.29063C9.93159 7.00353 9.92228 6.52875 10.2094 6.23017C10.4965 5.93159 10.9713 5.92228 11.2698 6.20938L14.7698 9.45938C14.9169 9.60078 15 9.79599 15 10C15 10.204 14.9169 10.3992 14.7698 10.5406L11.2698 13.7906C10.9713 14.0777 10.4965 14.0684 10.2094 13.7698C9.92228 13.4713 9.93159 12.9965 10.2302 12.7094L12.3879 10.75H5.75C5.33579 10.75 5 10.4142 5 10Z"],
    "USERCIRCLE": ["M17.9815 18.7248C16.6121 16.9175 14.4424 15.75 12 15.75C9.55761 15.75 7.38789 16.9175 6.01846 18.7248M17.9815 18.7248C19.8335 17.0763 21 14.6744 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 14.6744 4.1665 17.0763 6.01846 18.7248M17.9815 18.7248C16.3915 20.1401 14.2962 21 12 21C9.70383 21 7.60851 20.1401 6.01846 18.7248M15 9.75C15 11.4069 13.6569 12.75 12 12.75C10.3431 12.75 9 11.4069 9 9.75C9 8.09315 10.3431 6.75 12 6.75C13.6569 6.75 15 8.09315 15 9.75Z"],
    "NEWSPAPER": ["M12 7.5H13.5M12 10.5H13.5M6 13.5H13.5M6 16.5H13.5M16.5 7.5H19.875C20.4963 7.5 21 8.00368 21 8.625V18C21 19.2426 19.9926 20.25 18.75 20.25M16.5 7.5V18C16.5 19.2426 17.5074 20.25 18.75 20.25M16.5 7.5V4.875C16.5 4.25368 15.9963 3.75 15.375 3.75H4.125C3.50368 3.75 3 4.25368 3 4.875V18C3 19.2426 4.00736 20.25 5.25 20.25H18.75M6 7.5H9V10.5H6V7.5Z"],
    "BANKNOTES": ["M2.25 18.75C7.71719 18.75 13.0136 19.4812 18.0468 20.8512C18.7738 21.0491 19.5 20.5086 19.5 19.7551V18.75M3.75 4.5V5.25C3.75 5.66421 3.41421 6 3 6H2.25M2.25 6V5.625C2.25 5.00368 2.75368 4.5 3.375 4.5H20.25M2.25 6V15M20.25 4.5V5.25C20.25 5.66421 20.5858 6 21 6H21.75M20.25 4.5H20.625C21.2463 4.5 21.75 5.00368 21.75 5.625V15.375C21.75 15.9963 21.2463 16.5 20.625 16.5H20.25M21.75 15H21C20.5858 15 20.25 15.3358 20.25 15.75V16.5M20.25 16.5H3.75M3.75 16.5H3.375C2.75368 16.5 2.25 15.9963 2.25 15.375V15M3.75 16.5V15.75C3.75 15.3358 3.41421 15 3 15H2.25M15 10.5C15 12.1569 13.6569 13.5 12 13.5C10.3431 13.5 9 12.1569 9 10.5C9 8.84315 10.3431 7.5 12 7.5C13.6569 7.5 15 8.84315 15 10.5ZM18 10.5H18.0075V10.5075H18V10.5ZM6 10.5H6.0075V10.5075H6V10.5Z"],
    "ARROWLEFTRECT": ["M15.75 9V5.25C15.75 4.00736 14.7426 3 13.5 3L7.5 3C6.25736 3 5.25 4.00736 5.25 5.25L5.25 18.75C5.25 19.9926 6.25736 21 7.5 21H13.5C14.7426 21 15.75 19.9926 15.75 18.75V15M12 9L9 12M9 12L12 15M9 12L21.75 12"],
    "ARROWUP": ["M11.4697 2.46967C11.7626 2.17678 12.2374 2.17678 12.5303 2.46967L20.0303 9.96967C20.3232 10.2626 20.3232 10.7374 20.0303 11.0303C19.7374 11.3232 19.2626 11.3232 18.9697 11.0303L12.75 4.81066V21C12.75 21.4142 12.4142 21.75 12 21.75C11.5858 21.75 11.25 21.4142 11.25 21V4.81066L5.03033 11.0303C4.73744 11.3232 4.26256 11.3232 3.96967 11.0303C3.67678 10.7374 3.67678 10.2626 3.96967 9.96967L11.4697 2.46967Z"],
    "ARROWDOWN": ["M12 2.25C12.4142 2.25 12.75 2.58579 12.75 3L12.75 19.1893L18.9697 12.9697C19.2626 12.6768 19.7374 12.6768 20.0303 12.9697C20.3232 13.2626 20.3232 13.7374 20.0303 14.0303L12.5303 21.5303C12.2374 21.8232 11.7626 21.8232 11.4697 21.5303L3.96967 14.0303C3.67678 13.7374 3.67678 13.2626 3.96967 12.9697C4.26256 12.6768 4.73744 12.6768 5.03033 12.9697L11.25 19.1893L11.25 3C11.25 2.58579 11.5858 2.25 12 2.25Z"],
    "WALLET": ["M21 12C21 10.7574 19.9926 9.75 18.75 9.75H15C15 11.4069 13.6569 12.75 12 12.75C10.3431 12.75 9 11.4069 9 9.75H5.25C4.00736 9.75 3 10.7574 3 12M21 12V18C21 19.2426 19.9926 20.25 18.75 20.25H5.25C4.00736 20.25 3 19.2426 3 18V12M21 12V9M3 12V9M21 9C21 7.75736 19.9926 6.75 18.75 6.75H5.25C4.00736 6.75 3 7.75736 3 9M21 9V6C21 4.75736 19.9926 3.75 18.75 3.75H5.25C4.00736 3.75 3 4.75736 3 6V9"],
    "ARROWUPTRAY": ["M3 16.5V18.75C3 19.9926 4.00736 21 5.25 21H18.75C19.9926 21 21 19.9926 21 18.75V16.5M7.5 7.5L12 3M12 3L16.5 7.5M12 3L12 16.5"],
    "XCIRCLE": ["M9.75 9.75L14.25 14.25M14.25 9.75L9.75 14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"],
    "CHECK": ["M19.916 4.62604C20.2607 4.85581 20.3538 5.32146 20.124 5.6661L11.124 19.1661C10.9994 19.3531 10.7975 19.4743 10.5739 19.4964C10.3503 19.5186 10.1286 19.4393 9.96967 19.2804L3.96967 13.2804C3.67678 12.9875 3.67678 12.5126 3.96967 12.2197C4.26256 11.9269 4.73744 11.9269 5.03033 12.2197L10.3834 17.5729L18.876 4.83405C19.1057 4.48941 19.5714 4.39628 19.916 4.62604Z"],
    "CAM": ["M15.75 10.5L20.4697 5.78033C20.9421 5.30786 21.75 5.64248 21.75 6.31066V17.6893C21.75 18.3575 20.9421 18.6921 20.4697 18.2197L15.75 13.5M4.5 18.75H13.5C14.7426 18.75 15.75 17.7426 15.75 16.5V7.5C15.75 6.25736 14.7426 5.25 13.5 5.25H4.5C3.25736 5.25 2.25 6.25736 2.25 7.5V16.5C2.25 17.7426 3.25736 18.75 4.5 18.75Z"],
    "MIC": ["M12 18.75C15.3137 18.75 18 16.0637 18 12.75V11.25M12 18.75C8.68629 18.75 6 16.0637 6 12.75V11.25M12 18.75V22.5M8.25 22.5H15.75M12 15.75C10.3431 15.75 9 14.4069 9 12.75V4.5C9 2.84315 10.3431 1.5 12 1.5C13.6569 1.5 15 2.84315 15 4.5V12.75C15 14.4069 13.6569 15.75 12 15.75Z"],
    "HEART": ["M11.645 20.9107L11.6384 20.9071L11.6158 20.8949C11.5965 20.8844 11.5689 20.8693 11.5336 20.8496C11.4629 20.8101 11.3612 20.7524 11.233 20.6769C10.9765 20.5261 10.6132 20.3039 10.1785 20.015C9.31074 19.4381 8.15122 18.5901 6.9886 17.5063C4.68781 15.3615 2.25 12.1751 2.25 8.25C2.25 5.32194 4.7136 3 7.6875 3C9.43638 3 11.0023 3.79909 12 5.0516C12.9977 3.79909 14.5636 3 16.3125 3C19.2864 3 21.75 5.32194 21.75 8.25C21.75 12.1751 19.3122 15.3615 17.0114 17.5063C15.8488 18.5901 14.6893 19.4381 13.8215 20.015C13.3868 20.3039 13.0235 20.5261 12.767 20.6769C12.6388 20.7524 12.5371 20.8101 12.4664 20.8496C12.4311 20.8693 12.4035 20.8844 12.3842 20.8949L12.3616 20.9071L12.355 20.9107L12.3523 20.9121C12.1323 21.0289 11.8677 21.0289 11.6477 20.9121L11.645 20.9107Z"],
    "PAUSE": ["M6.75 5.25C6.75 4.83579 7.08579 4.5 7.5 4.5H9C9.41421 4.5 9.75 4.83579 9.75 5.25V18.75C9.75 19.1642 9.41421 19.5 9 19.5H7.5C7.30109 19.5 7.11032 19.421 6.96967 19.2803C6.82902 19.1397 6.75 18.9489 6.75 18.75L6.75 5.25ZM14.25 5.25C14.25 4.83579 14.5858 4.5 15 4.5H16.5C16.6989 4.5 16.8897 4.57902 17.0303 4.71967C17.171 4.86032 17.25 5.05109 17.25 5.25L17.25 18.75C17.25 19.1642 16.9142 19.5 16.5 19.5H15C14.5858 19.5 14.25 19.1642 14.25 18.75V5.25Z"],
    "PLAY": ["M4.5 5.65306C4.5 4.22693 6.029 3.32288 7.2786 4.01016L18.8192 10.3575C20.1144 11.0698 20.1144 12.9309 18.8192 13.6433L7.2786 19.9906C6.029 20.6779 4.5 19.7738 4.5 18.3477V5.65306Z"],
    "CHEVRIGHT": ["M16.2803 11.4697C16.5732 11.7626 16.5732 12.2374 16.2803 12.5303L8.78033 20.0303C8.48744 20.3232 8.01256 20.3232 7.71967 20.0303C7.42678 19.7374 7.42678 19.2626 7.71967 18.9697L14.6893 12L7.71967 5.03033C7.42678 4.73744 7.42678 4.26256 7.71967 3.96967C8.01256 3.67678 8.48744 3.67678 8.78033 3.96967L16.2803 11.4697Z"],
    "CHEVLEFT": ["M7.71967 12.5303C7.42678 12.2374 7.42678 11.7626 7.71967 11.4697L15.2197 3.96967C15.5126 3.67678 15.9874 3.67678 16.2803 3.96967C16.5732 4.26256 16.5732 4.73744 16.2803 5.03033L9.31066 12L16.2803 18.9697C16.5732 19.2626 16.5732 19.7374 16.2803 20.0303C15.9874 20.3232 15.5126 20.3232 15.2197 20.0303L7.71967 12.5303Z"],
    "PHOTO": ["M2.25 15.75L7.40901 10.591C8.28769 9.71231 9.71231 9.71231 10.591 10.591L15.75 15.75M14.25 14.25L15.659 12.841C16.5377 11.9623 17.9623 11.9623 18.841 12.841L21.75 15.75M3.75 19.5H20.25C21.0784 19.5 21.75 18.8284 21.75 18V6C21.75 5.17157 21.0784 4.5 20.25 4.5H3.75C2.92157 4.5 2.25 5.17157 2.25 6V18C2.25 18.8284 2.92157 19.5 3.75 19.5ZM14.25 8.25H14.2575V8.2575H14.25V8.25ZM14.625 8.25C14.625 8.45711 14.4571 8.625 14.25 8.625C14.0429 8.625 13.875 8.45711 13.875 8.25C13.875 8.04289 14.0429 7.875 14.25 7.875C14.4571 7.875 14.625 8.04289 14.625 8.25Z"],
    "ATSYMBOL": ["M17.8336 6.16637C14.6118 2.94454 9.38819 2.94454 6.16637 6.16637C2.94454 9.38819 2.94454 14.6118 6.16637 17.8336C9.38819 21.0555 14.6118 21.0555 17.8336 17.8336C18.1265 17.5407 18.6014 17.5407 18.8943 17.8336C19.1872 18.1265 19.1872 18.6014 18.8943 18.8943C15.0867 22.7019 8.91332 22.7019 5.10571 18.8943C1.2981 15.0867 1.2981 8.91332 5.10571 5.10571C8.91332 1.2981 15.0867 1.2981 18.8943 5.10571C20.798 7.00937 21.75 9.50593 21.75 12C21.75 12.975 21.4545 13.8866 20.941 14.5713C20.4273 15.2563 19.6603 15.75 18.75 15.75C17.8462 15.75 17.0837 15.2633 16.57 14.5859C15.668 16.1767 13.9593 17.25 12 17.25C9.1005 17.25 6.75 14.8995 6.75 12C6.75 9.1005 9.1005 6.75 12 6.75C13.469 6.75 14.7971 7.35335 15.75 8.32576V8.25C15.75 7.83579 16.0858 7.5 16.5 7.5C16.9142 7.5 17.25 7.83579 17.25 8.25V12C17.25 12.6818 17.4582 13.2703 17.759 13.6713C18.0596 14.0721 18.4177 14.25 18.75 14.25C19.0823 14.25 19.4404 14.0721 19.741 13.6713C20.0418 13.2703 20.25 12.6819 20.25 12C20.25 9.88749 19.4447 7.77743 17.8336 6.16637ZM15.75 12C15.75 9.92893 14.0711 8.25 12 8.25C9.92893 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92893 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12Z"],
    "HASHTAG": ["M11.0974 1.51471C11.5035 1.59594 11.767 1.99106 11.6857 2.39723L10.6651 7.50015H15.1351L16.2146 2.10306C16.2958 1.69689 16.6909 1.43348 17.0971 1.51471C17.5033 1.59594 17.7667 1.99106 17.6854 2.39723L16.6649 7.50015H20.25C20.6642 7.50015 21 7.83593 21 8.25015C21 8.66436 20.6642 9.00015 20.25 9.00015H16.3649L15.1649 15.0001H18.75C19.1642 15.0001 19.5 15.3359 19.5 15.7501C19.5 16.1644 19.1642 16.5001 18.75 16.5001H14.8649L13.7854 21.8972C13.7042 22.3034 13.3091 22.5668 12.9029 22.4856C12.4967 22.4043 12.2333 22.0092 12.3146 21.6031L13.3351 16.5001H8.86515L7.78573 21.8972C7.70449 22.3034 7.30938 22.5668 6.90321 22.4856C6.49704 22.4043 6.23362 22.0092 6.31486 21.6031L7.33544 16.5001H3.75C3.33579 16.5001 3 16.1644 3 15.7501C3 15.3359 3.33579 15.0001 3.75 15.0001H7.63544L8.83544 9.00015H5.25C4.83579 9.00015 4.5 8.66436 4.5 8.25015C4.5 7.83593 4.83579 7.50015 5.25 7.50015H9.13544L10.2149 2.10306C10.2961 1.69689 10.6912 1.43348 11.0974 1.51471ZM10.3651 9.00015L9.16515 15.0001H13.6351L14.8351 9.00015H10.3651Z"],
    "RSS": ["M3.75 4.5C3.75 4.08579 4.08579 3.75 4.5 3.75H5.25C13.5343 3.75 20.25 10.4657 20.25 18.75V19.5C20.25 19.9142 19.9142 20.25 19.5 20.25H18.75C18.3358 20.25 18 19.9142 18 19.5V18.75C18 11.7084 12.2916 6 5.25 6H4.5C4.08579 6 3.75 5.66421 3.75 5.25V4.5ZM3.75 11.25C3.75 10.8358 4.08579 10.5 4.5 10.5H5.25C9.80635 10.5 13.5 14.1937 13.5 18.75V19.5C13.5 19.9142 13.1642 20.25 12.75 20.25H12C11.5858 20.25 11.25 19.9142 11.25 19.5V18.75C11.25 15.4363 8.56371 12.75 5.25 12.75H4.5C4.08579 12.75 3.75 12.4142 3.75 12V11.25ZM3.75 18.75C3.75 17.9216 4.42157 17.25 5.25 17.25C6.07843 17.25 6.75 17.9216 6.75 18.75C6.75 19.5784 6.07843 20.25 5.25 20.25C4.42157 20.25 3.75 19.5784 3.75 18.75Z" ],
    "ARROWSOUT": ["M15 3.75C15 3.33579 15.3358 3 15.75 3L20.25 3C20.6642 3 21 3.33579 21 3.75V8.25C21 8.66421 20.6642 9 20.25 9C19.8358 9 19.5 8.66421 19.5 8.25V5.56066L15.5303 9.53033C15.2374 9.82322 14.7626 9.82322 14.4697 9.53033C14.1768 9.23744 14.1768 8.76256 14.4697 8.46967L18.4393 4.5H15.75C15.3358 4.5 15 4.16421 15 3.75ZM3 3.75C3 3.33579 3.33579 3 3.75 3H8.25C8.66421 3 9 3.33579 9 3.75C9 4.16421 8.66421 4.5 8.25 4.5H5.56066L9.53033 8.46967C9.82322 8.76256 9.82322 9.23744 9.53033 9.53033C9.23744 9.82322 8.76256 9.82322 8.46967 9.53033L4.5 5.56066V8.25C4.5 8.66421 4.16421 9 3.75 9C3.33579 9 3 8.66421 3 8.25V3.75ZM14.4697 15.5303C14.1768 15.2374 14.1768 14.7626 14.4697 14.4697C14.7626 14.1768 15.2374 14.1768 15.5303 14.4697L19.5 18.4393V15.75C19.5 15.3358 19.8358 15 20.25 15C20.6642 15 21 15.3358 21 15.75V20.25C21 20.6642 20.6642 21 20.25 21H15.75C15.3358 21 15 20.6642 15 20.25C15 19.8358 15.3358 19.5 15.75 19.5H18.4393L14.4697 15.5303ZM9.53033 14.4697C9.82322 14.7626 9.82322 15.2374 9.53033 15.5303L5.56066 19.5H8.25C8.66421 19.5 9 19.8358 9 20.25C9 20.6642 8.66421 21 8.25 21H3.75C3.33579 21 3 20.6642 3 20.25V15.75C3 15.3358 3.33579 15 3.75 15C4.16421 15 4.5 15.3358 4.5 15.75V18.4393L8.46967 14.4697C8.76256 14.1768 9.23744 14.1768 9.53033 14.4697Z"],
    "HOME": ["M2.25 11.9998L11.2045 3.04533C11.6438 2.60599 12.3562 2.60599 12.7955 3.04532L21.75 11.9998M4.5 9.74983V19.8748C4.5 20.4961 5.00368 20.9998 5.625 20.9998H9.75V16.1248C9.75 15.5035 10.2537 14.9998 10.875 14.9998H13.125C13.7463 14.9998 14.25 15.5035 14.25 16.1248V20.9998H18.375C18.9963 20.9998 19.5 20.4962 19.5 19.8748V9.74983M8.25 20.9998H16.5"],
    "RECTANGLESTACK": ["M6 6.87803V6C6 4.75736 7.00736 3.75 8.25 3.75H15.75C16.9926 3.75 18 4.75736 18 6V6.87803M6 6.87803C6.23458 6.79512 6.48702 6.75 6.75 6.75H17.25C17.513 6.75 17.7654 6.79512 18 6.87803M6 6.87803C5.12611 7.18691 4.5 8.02034 4.5 9V9.87803M18 6.87803C18.8739 7.18691 19.5 8.02034 19.5 9V9.87803M19.5 9.87803C19.2654 9.79512 19.013 9.75 18.75 9.75H5.25C4.98702 9.75 4.73458 9.79512 4.5 9.87803M19.5 9.87803C20.3739 10.1869 21 11.0203 21 12V18C21 19.2426 19.9926 20.25 18.75 20.25H5.25C4.00736 20.25 3 19.2426 3 18V12C3 11.0203 3.62611 10.1869 4.5 9.87803"],
    "QUESTION": ["M9.87891 7.51884C11.0505 6.49372 12.95 6.49372 14.1215 7.51884C15.2931 8.54397 15.2931 10.206 14.1215 11.2312C13.9176 11.4096 13.6917 11.5569 13.4513 11.6733C12.7056 12.0341 12.0002 12.6716 12.0002 13.5V14.25M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12ZM12 17.25H12.0075V17.2575H12V17.25Z"],

    "ARROWTOPSQUARE": ["M4.25 5.5C3.83579 5.5 3.5 5.83579 3.5 6.25V14.75C3.5 15.1642 3.83579 15.5 4.25 15.5H12.75C13.1642 15.5 13.5 15.1642 13.5 14.75V10.75C13.5 10.3358 13.8358 10 14.25 10C14.6642 10 15 10.3358 15 10.75V14.75C15 15.9926 13.9926 17 12.75 17H4.25C3.00736 17 2 15.9926 2 14.75V6.25C2 5.00736 3.00736 4 4.25 4H9.25C9.66421 4 10 4.33579 10 4.75C10 5.16421 9.66421 5.5 9.25 5.5H4.25Z",
    "M6.19385 12.7532C6.47175 13.0603 6.94603 13.0841 7.25319 12.8062L16.5 4.43999V7.25C16.5 7.66421 16.8358 8 17.25 8C17.6642 8 18 7.66421 18 7.25V2.75C18 2.33579 17.6642 2 17.25 2H12.75C12.3358 2 12 2.33579 12 2.75C12 3.16421 12.3358 3.5 12.75 3.5H15.3032L6.24682 11.6938C5.93966 11.9717 5.91595 12.446 6.19385 12.7532Z"],

    "ARROWDOWNTRAY": ["M10.75 2.75C10.75 2.33579 10.4142 2 10 2C9.58579 2 9.25 2.33579 9.25 2.75V11.3636L6.29526 8.23503C6.01085 7.93389 5.53617 7.92033 5.23503 8.20474C4.9339 8.48915 4.92033 8.96383 5.20474 9.26497L9.45474 13.765C9.59642 13.915 9.79366 14 10 14C10.2063 14 10.4036 13.915 10.5453 13.765L14.7953 9.26497C15.0797 8.96383 15.0661 8.48915 14.765 8.20474C14.4638 7.92033 13.9892 7.93389 13.7047 8.23503L10.75 11.3636V2.75Z",
    "M3.5 12.75C3.5 12.3358 3.16421 12 2.75 12C2.33579 12 2 12.3358 2 12.75V15.25C2 16.7688 3.23122 18 4.75 18H15.25C16.7688 18 18 16.7688 18 15.25V12.75C18 12.3358 17.6642 12 17.25 12C16.8358 12 16.5 12.3358 16.5 12.75V15.25C16.5 15.9404 15.9404 16.5 15.25 16.5H4.75C4.05964 16.5 3.5 15.9404 3.5 15.25V12.75Z"],

    "DOLLAR": ["M10.7499 10.8176V13.4324C11.1816 13.3527 11.5745 13.2046 11.8876 12.9999C12.3698 12.6846 12.4999 12.352 12.4999 12.125C12.4999 11.898 12.3698 11.5654 11.8876 11.2501C11.5745 11.0454 11.1816 10.8973 10.7499 10.8176Z",
    "M8.32961 8.61947C8.38337 8.67543 8.44464 8.73053 8.51404 8.78416C8.72197 8.94484 8.97355 9.06777 9.25 9.1469V6.60315C9.17545 6.62449 9.10271 6.64901 9.03215 6.6766C8.98721 6.69417 8.94315 6.71299 8.90007 6.73302C8.75996 6.79816 8.63019 6.87614 8.51404 6.96589C8.13658 7.25757 8 7.59253 8 7.87503C8 8.05887 8.05784 8.26493 8.20228 8.46683C8.23898 8.51812 8.28126 8.56915 8.32961 8.61947Z",
    "M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10ZM9.99994 4C10.4142 4 10.7499 4.33579 10.7499 4.75V5.06584C11.3423 5.17106 11.9182 5.40427 12.4031 5.77893C12.8293 6.10829 13.1467 6.51836 13.3282 6.97896C13.4801 7.36432 13.2908 7.79985 12.9055 7.95174C12.5201 8.10363 12.0846 7.91437 11.9327 7.52901C11.8599 7.34437 11.72 7.14675 11.4859 6.96586C11.278 6.80519 11.0264 6.68225 10.7499 6.60312V9.29944C11.448 9.39233 12.1327 9.61819 12.7085 9.99467C13.4955 10.5093 13.9999 11.2644 13.9999 12.125C13.9999 12.9856 13.4955 13.7407 12.7085 14.2553C12.1327 14.6318 11.448 14.8577 10.7499 14.9506V15.25C10.7499 15.6642 10.4142 16 9.99994 16C9.58573 16 9.24994 15.6642 9.24994 15.25V14.9506C8.55186 14.8577 7.8672 14.6318 7.29141 14.2553C6.80887 13.9398 6.4337 13.5376 6.21337 13.0672C6.0377 12.692 6.19937 12.2455 6.57449 12.0699C6.9496 11.8942 7.39611 12.0559 7.57178 12.431C7.65258 12.6035 7.81692 12.8067 8.11229 12.9999C8.42537 13.2046 8.8183 13.3526 9.24994 13.4324V10.6842C8.65762 10.5789 8.08167 10.3457 7.59681 9.97107C6.90033 9.43288 6.49994 8.68017 6.49994 7.875C6.49994 7.06983 6.90034 6.31712 7.59681 5.77893C8.08167 5.40427 8.65762 5.17106 9.24994 5.06584V4.75C9.24994 4.33579 9.58573 4 9.99994 4Z"],

    "LANGUAGE": ["M9.00004 2.25C9.41425 2.25 9.75004 2.58579 9.75004 3V4.50565C10.6344 4.519 11.5132 4.55589 12.3856 4.61576C13.2951 4.67816 14.1977 4.7655 15.0928 4.87713C15.5039 4.92838 15.7955 5.30314 15.7443 5.71417C15.693 6.1252 15.3183 6.41685 14.9072 6.3656C14.2477 6.28336 13.5839 6.21471 12.9162 6.15993C12.3254 8.46971 11.3061 10.6074 9.94797 12.4834C10.2648 12.8666 10.5979 13.236 10.9462 13.5905C11.2366 13.8859 11.2324 14.3607 10.937 14.6511C10.6416 14.9414 10.1667 14.9373 9.87639 14.6419C9.57352 14.3337 9.2812 14.015 9.00003 13.6866C7.4289 15.522 5.50944 17.0501 3.34426 18.1686C2.97625 18.3587 2.52381 18.2145 2.3337 17.8465C2.14358 17.4785 2.2878 17.026 2.65581 16.8359C4.7376 15.7605 6.57216 14.2737 8.05211 12.4834C7.18602 11.2869 6.4576 9.984 5.89024 8.59774C5.73335 8.21439 5.91693 7.77643 6.30028 7.61954C6.68363 7.46265 7.12158 7.64623 7.27848 8.02957C7.74079 9.15919 8.3196 10.229 9.00003 11.2242C10.0649 9.66674 10.881 7.92604 11.3912 6.05944C10.5992 6.01997 9.80199 6 9.00004 6C6.99917 6 5.02769 6.12433 3.09284 6.3656C2.68181 6.41685 2.30705 6.1252 2.2558 5.71417C2.20454 5.30314 2.4962 4.92838 2.90723 4.87713C4.66117 4.65841 6.44383 4.5329 8.25004 4.50565V3C8.25004 2.58579 8.58582 2.25 9.00004 2.25ZM15.75 9C16.0414 9 16.3064 9.16878 16.4297 9.43284L21.6797 20.6828C21.8548 21.0582 21.6926 21.5045 21.3172 21.6796C20.9418 21.8548 20.4956 21.6925 20.3204 21.3172L19.1224 18.75H12.3777L11.1797 21.3172C11.0045 21.6925 10.5582 21.8548 10.1829 21.6796C9.80752 21.5045 9.64523 21.0582 9.8204 20.6828L15.0704 9.43284C15.1936 9.16878 15.4586 9 15.75 9ZM13.0777 17.25H18.4224L15.75 11.5235L13.0777 17.25Z"],
    "USERPLUS": ["M11 5C11 6.65685 9.65685 8 8 8C6.34315 8 5 6.65685 5 5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5Z",
    "M2.61528 16.428C2.21798 16.1736 1.98785 15.721 2.04605 15.2529C2.41416 12.292 4.93944 10 7.9999 10C11.0604 10 13.5856 12.2914 13.9537 15.2522C14.012 15.7203 13.7818 16.1729 13.3845 16.4273C11.8302 17.4225 9.98243 18 7.9999 18C6.01737 18 4.16959 17.4231 2.61528 16.428Z",
    "M16.25 5.75C16.25 5.33579 15.9142 5 15.5 5C15.0858 5 14.75 5.33579 14.75 5.75V7.75H12.75C12.3358 7.75 12 8.08579 12 8.5C12 8.91421 12.3358 9.25 12.75 9.25H14.75V11.25C14.75 11.6642 15.0858 12 15.5 12C15.9142 12 16.25 11.6642 16.25 11.25V9.25H18.25C18.6642 9.25 19 8.91421 19 8.5C19 8.08579 18.6642 7.75 18.25 7.75H16.25V5.75Z"],
    
    "USERMINUS": ["M11 5C11 6.65685 9.65685 8 8 8C6.34315 8 5 6.65685 5 5C5 3.34315 6.34315 2 8 2C9.65685 2 11 3.34315 11 5Z",
    "M2.04605 15.2529C1.98785 15.721 2.21798 16.1736 2.61528 16.428C4.16959 17.4231 6.01737 18 7.9999 18C9.98243 18 11.8302 17.4225 13.3845 16.4273C13.7818 16.1729 14.012 15.7203 13.9537 15.2522C13.5856 12.2914 11.0604 10 7.9999 10C4.93944 10 2.41416 12.292 2.04605 15.2529Z",
    "M12.75 7.75C12.3358 7.75 12 8.08579 12 8.5C12 8.91421 12.3358 9.25 12.75 9.25H18.25C18.6642 9.25 19 8.91421 19 8.5C19 8.08579 18.6642 7.75 18.25 7.75H12.75Z"],

    "CAMERA": ["M6.82689 6.1749C6.46581 6.75354 5.86127 7.13398 5.186 7.22994C4.80655 7.28386 4.42853 7.34223 4.05199 7.40497C2.99912 7.58042 2.25 8.50663 2.25 9.57402V18C2.25 19.2426 3.25736 20.25 4.5 20.25H19.5C20.7426 20.25 21.75 19.2426 21.75 18V9.57403C21.75 8.50664 21.0009 7.58043 19.948 7.40498C19.5715 7.34223 19.1934 7.28387 18.814 7.22995C18.1387 7.13398 17.5342 6.75354 17.1731 6.17491L16.3519 4.85889C15.9734 4.25237 15.3294 3.85838 14.6155 3.82005C13.7496 3.77355 12.8775 3.75 12 3.75C11.1225 3.75 10.2504 3.77355 9.3845 3.82005C8.6706 3.85838 8.02658 4.25237 7.64809 4.85889L6.82689 6.1749Z",
    "M16.5 12.75C16.5 15.2353 14.4853 17.25 12 17.25C9.51472 17.25 7.5 15.2353 7.5 12.75C7.5 10.2647 9.51472 8.25 12 8.25C14.4853 8.25 16.5 10.2647 16.5 12.75Z",
    "M18.75 10.5H18.7575V10.5075H18.75V10.5Z"],

    "PENCIL": ["M5.43306 13.9168L6.69485 10.7623C6.89603 10.2593 7.19728 9.80249 7.58033 9.41945L14.4995 2.50071C15.3279 1.67229 16.6711 1.67229 17.4995 2.50072C18.3279 3.32914 18.3279 4.67229 17.4995 5.50072L10.5803 12.4194C10.1973 12.8025 9.74042 13.1037 9.23746 13.3049L6.08299 14.5667C5.67484 14.73 5.2698 14.3249 5.43306 13.9168Z",
    "M3.5 5.75C3.5 5.05964 4.05964 4.5 4.75 4.5H10C10.4142 4.5 10.75 4.16421 10.75 3.75C10.75 3.33579 10.4142 3 10 3H4.75C3.23122 3 2 4.23122 2 5.75V15.25C2 16.7688 3.23122 18 4.75 18H14.25C15.7688 18 17 16.7688 17 15.25V10C17 9.58579 16.6642 9.25 16.25 9.25C15.8358 9.25 15.5 9.58579 15.5 10V15.25C15.5 15.9404 14.9404 16.5 14.25 16.5H4.75C4.05964 16.5 3.5 15.9404 3.5 15.25V5.75Z"],

    "BAR3BOTTOM": ["M3.75 6.75H20.25M3.75 12H20.25M12 17.25H20.25"],
    "CLOCK": ["M12 6V12H16.5M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"],
    "EYESLASH": ["M3.9799 8.22257C3.05679 9.31382 2.35239 10.596 1.93433 12.0015C3.22562 16.338 7.24308 19.5 11.9991 19.5C12.9916 19.5 13.952 19.3623 14.8622 19.1049M6.2276 6.22763C7.88385 5.13558 9.86768 4.5 11.9999 4.5C16.7559 4.5 20.7734 7.66205 22.0647 11.9985C21.3528 14.3919 19.8105 16.4277 17.772 17.772M6.2276 6.22763L2.99997 3M6.2276 6.22763L9.87865 9.87868M17.772 17.772L21 21M17.772 17.772L14.1213 14.1213M14.1213 14.1213C14.6642 13.5784 15 12.8284 15 12C15 10.3431 13.6568 9 12 9C11.1715 9 10.4215 9.33579 9.87865 9.87868M14.1213 14.1213L9.87865 9.87868"],
    "XMARK": ["M6 18L18 6M6 6L18 18"],
    "PLUS": ["M10.75 4.75C10.75 4.33579 10.4142 4 10 4C9.58579 4 9.25 4.33579 9.25 4.75V9.25H4.75C4.33579 9.25 4 9.58579 4 10C4 10.4142 4.33579 10.75 4.75 10.75L9.25 10.75V15.25C9.25 15.6642 9.58579 16 10 16C10.4142 16 10.75 15.6642 10.75 15.25V10.75L15.25 10.75C15.6642 10.75 16 10.4142 16 10C16 9.58579 15.6642 9.25 15.25 9.25H10.75V4.75Z"],
    "MAGNIFY": ["M21 21L15.8033 15.8033M15.8033 15.8033C17.1605 14.4461 18 12.5711 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18C12.5711 18 14.4461 17.1605 15.8033 15.8033Z"]
}

export function Icon({className="", style={}, stroke="currentColor", fill="none", icon, strokeWidth="2", onClick = () => {}}, pathClass="") {
    console.log(style)
  return (
    <svg viewBox="0 0 24 24" fill={fill} stroke-width={strokeWidth} stroke={stroke} xmlns="http://www.w3.org/2000/svg" className={className} onClick={onClick} style={style || {}}>
        {icons[icon].map((icon, index) => (
        <path
            key={index}
            fillRule="evenodd"
            clipRule="evenodd"
            d={icon}

        />
        ))}
    </svg>
  );
}