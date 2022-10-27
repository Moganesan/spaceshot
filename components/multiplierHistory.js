import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const MultiplierHistory = () => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={13}
      onSlideChange={() => console.log("slide change")}
      onSwiper={(swiper) => console.log(swiper)}
    >
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-blue-600 bg-blue-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-green-600 bg-green-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-green-600 bg-green-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-blue-600 bg-blue-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-blue-600 bg-blue-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-blue-600 bg-blue-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-yellow-600 bg-yellow-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-yellow-600 bg-yellow-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-yellow-600 bg-yellow-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-green-600 bg-green-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-green-600 bg-green-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-green-600 bg-green-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-blue-600 bg-blue-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>

      <SwiperSlide>
        <div className="py-2 w-32 rounded-sm flex items-center justify-center border-2 border-blue-600 bg-blue-400">
          <span>1.55</span>
        </div>
      </SwiperSlide>
    </Swiper>
  );
};

export default MultiplierHistory;
