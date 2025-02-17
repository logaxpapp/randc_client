import React, { useState } from 'react';
import clsx from 'clsx';

interface IPromo {
  _id: string;
  code: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
}

const FancyPromoCard: React.FC<{ promo: IPromo }> = ({ promo }) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative w-64 h-40 cursor-pointer perspective"
      style={{ perspective: '1000px' }}
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={clsx(
          "relative w-full h-full duration-700 transition-transform preserve-3d",
          flipped && "rotate-y-180"
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div
          className={clsx(
            "absolute w-full h-full rounded-xl shadow-lg p-4 flex flex-col justify-between backface-hidden",
            "bg-gradient-to-t from-[#000103] via-[#7f6bf0] to-[#010407] text-white border-2 border-blue-300"
          )}
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div> {/* Card Number Area */}
            <p className="text-sm font-bold text-white opacity-70">
              **** **** **** 1234 {/* Fictitious card number */}
            </p>
          </div>
          <div className="flex items-center justify-center">
            <p className="font-bold text-2xl tracking-wide">Promo Code</p>
          </div>
          <div className="mt-auto"> {/* Expiration and Description */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-white font-bold">Expires: 12/25</p> {/* Fictitious Expiration */}
              <p className="font-bold text-xl text-gray-100">Flip Me</p>
            </div>
            <p className="text-sm mt-1">{promo.description || 'Tap to flip'}</p>
          </div>
        </div>

        {/* Back */}
        <div
          className={clsx(
            "absolute w-full h-full rounded-xl shadow-lg p-4 flex flex-col justify-between backface-hidden rotate-y-180",
            "bg-white border-2 border-gray-200"
          )}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="text-center">
            <p className="font-bold text-2xl text-blue-600 tracking-wide mt-2">{promo.code}</p>
          </div>
          <div className="flex justify-center items-center text-lg text-gray-700">
            {promo.discountType === 'PERCENT'
              ? `${promo.discountValue}% OFF`
              : `$${promo.discountValue} OFF`}
          </div>
          <div className="text-right text-gray-500 text-xs">
            * Terms &amp; conditions apply.
          </div>
        </div>
      </div>
    </div>
  );
};

export default FancyPromoCard;