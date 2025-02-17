import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import {
  FaMapMarkerAlt,
  FaPhone,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaRegClock,
  FaRegHeart,
  FaRegShareSquare,
  FaGift,
  FaTimes,
  FaCheckCircle,
  FaTags,
  FaTruck,
  FaCoins,
  FaPlus,
} from 'react-icons/fa';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import FancyPromoCard  from './FancyPromoCard';

// RTK Query hook for aggregated tenant data
import { useGetTenantMarketplaceDataQuery } from '../../features/public/publicApi';

// (Optional) separate reviews component if you have one
import ReviewsSection from './ReviewsSection';

// Fallback image
import imgStatic from '../../assets/images/r2.png';

// For mapping day-of-week in tenant.settings.workDays
const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** Minimal interface for the gallery doc: _id, name, description, images[] */
interface IGallery {
  _id: string;
  name: string;
  description: string;
  images: string[];
}

/** OverlappingCircles:
 *  Show up to 3 circular images, overlapped horizontally.
 */
interface OverlappingCirclesProps {
  images: string[];
  onClickCircle: (index: number) => void;
}
const OverlappingCircles: React.FC<OverlappingCirclesProps> = ({ images, onClickCircle }) => {
  const displayImages = images.slice(0, 3);
  const extraCount = images.length - displayImages.length;

  return (
    <div className="flex items-center relative h-16 w-32">
      {displayImages.map((imgUrl, i) => {
        const offset = i * 18;
        return (
          <div
            key={i}
            className="h-16 w-16 rounded-full border-2 border-white overflow-hidden cursor-pointer absolute"
            style={{ left: offset, zIndex: 10 - i }}
            onClick={() => onClickCircle(i)}
          >
            <img
              src={imgUrl || imgStatic}
              alt="Service"
              className="h-full w-full object-cover"
            />
          </div>
        );
      })}
      {extraCount > 0 && (
        <div
          className="h-16 w-16 rounded-full border-2 border-white bg-gray-300 text-gray-800 flex items-center justify-center cursor-pointer absolute"
          style={{ left: displayImages.length * 18, zIndex: 10 - displayImages.length }}
          onClick={() => onClickCircle(0)}
        >
          <FaPlus className="mr-1 text-sm" />
          {extraCount}
        </div>
      )}
    </div>
  );
};

/** IPromo: The shape of each promo object. */
interface IPromo {
  _id: string;
  code: string;
  description?: string;
  discountType: 'PERCENT' | 'FIXED';
  discountValue: number;
}


const BusinessDetailPage: React.FC = () => {
  const { businessId } = useParams<{ businessId: string }>();
  const navigate = useNavigate();

  // 1) Query aggregator data
  const {
    data: tenantData,
    isLoading,
    isError,
  } = useGetTenantMarketplaceDataQuery(businessId || '', {
    skip: !businessId,
  });

  // 2) Extract data
  const tenant = tenantData?.tenant;
  const services = tenantData?.services || [];
  const allGalleries: IGallery[] = tenantData?.galleries || [];
  const timeSlots = tenantData?.timeSlots || [];
  const promos: IPromo[] = tenantData?.promos || [];

  // 3) Banner images
  const bannerImages = tenant?.bannerImages || [];
  const totalBanners = bannerImages.length;
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    if (totalBanners < 2) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % totalBanners);
    }, 5000);
    return () => clearInterval(interval);
  }, [totalBanners]);

  const handleNextBanner = () =>
    setCurrentBannerIndex((prev) => (prev + 1) % totalBanners);
  const handlePrevBanner = () =>
    setCurrentBannerIndex((prev) => (prev - 1 + totalBanners) % totalBanners);

  // 4) Leaflet lat/lng
  const lat = tenant?.location?.coordinates?.[1];
  const lng = tenant?.location?.coordinates?.[0];

  // 5) Galleries pagination
  const PAGE_SIZE = 9;
  const [galleryPages, setGalleryPages] = useState<{ [id: string]: number }>({});

  useEffect(() => {
    if (allGalleries.length) {
      const initPages: { [id: string]: number } = {};
      allGalleries.forEach((g) => {
        initPages[g._id] = 1;
      });
      setGalleryPages(initPages);
    }
  }, [allGalleries]);

  const handleLoadMoreGallery = (galleryId: string) => {
    setGalleryPages((prev) => ({
      ...prev,
      [galleryId]: (prev[galleryId] || 1) + 1,
    }));
  };

  // 6) Lightbox for GALLERIES
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const openLightbox = (imgUrl: string) => {
    setLightboxImage(imgUrl);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage(null);
  };

  // 6-b) Lightbox/Popup for SERVICE images
  const [imagePopup, setImagePopup] = useState<{
    open: boolean;
    service: any;
    currentImageIndex: number;
  }>({
    open: false,
    service: null,
    currentImageIndex: 0,
  });

  const openImagePopup = (service: any, startIndex: number) => {
    setImagePopup({ open: true, service, currentImageIndex: startIndex });
  };

  const closeImagePopup = () => {
    setImagePopup({ open: false, service: null, currentImageIndex: 0 });
  };

  const nextImage = () => {
    if (imagePopup.service) {
      setImagePopup((prev) => ({
        ...prev,
        currentImageIndex: (prev.currentImageIndex + 1) % prev.service.images.length,
      }));
    }
  };
  const prevImage = () => {
    if (imagePopup.service) {
      setImagePopup((prev) => ({
        ...prev,
        currentImageIndex:
          (prev.currentImageIndex - 1 + prev.service.images.length) %
          prev.service.images.length,
      }));
    }
  };

  // 7) Loading / error states
  if (!businessId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Invalid tenant ID.</p>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading tenant details...</p>
      </div>
    );
  }
  if (isError || !tenant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load tenant data.</p>
      </div>
    );
  }

  // 8) Render
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-200 via-white to-lime-100">
      {/* Top Bar */}
      <div className="bg-white shadow p-4 flex items-center justify-between">
        <button
          className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <FaChevronLeft />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="text-lg font-bold text-gray-800">{tenant.name}</h1>
        <div />
      </div>

      {/* Banner Slideshow */}
      <div className="relative bg-black h-96 flex items-center justify-center max-w-7xl mx-auto overflow-hidden">
        {totalBanners > 0 && (
          <AnimatePresence mode="wait">
            <motion.img
              key={bannerImages[currentBannerIndex]}
              src={bannerImages[currentBannerIndex]}
              alt="Tenant Banner"
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
            />
          </AnimatePresence>
        )}
        {totalBanners > 1 && (
          <>
            <button
              onClick={handlePrevBanner}
              className="absolute left-4 text-white bg-gray-800 bg-opacity-50 p-2 rounded hover:bg-opacity-75 z-10"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={handleNextBanner}
              className="absolute right-4 text-white bg-gray-800 bg-opacity-50 p-2 rounded hover:bg-opacity-75 z-10"
            >
              <FaChevronRight />
            </button>
          </>
        )}
      </div>

      {/* 2-column layout */}
      <div className="max-w-7xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Tenant Header */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">{tenant.name}</h2>
            {tenant.rating && (
              <div className="flex items-center text-yellow-500 text-sm">
                <FaStar />
                <span className="ml-1">{tenant.rating.toFixed(1)}</span>
              </div>
            )}
            {tenant.address && (
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <FaMapMarkerAlt className="mr-2" />
                {tenant.address.street}, {tenant.address.city}
              </div>
            )}
            {tenant.companyPhoneNumber && (
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <FaPhone className="mr-2" />
                {tenant.companyPhoneNumber}
              </div>
            )}
            {tenant.domain && (
              <p className="text-sm text-blue-600 underline mt-1">
                <a href={tenant.domain} target="_blank" rel="noreferrer">
                  {tenant.domain}
                </a>
              </p>
            )}
          </div>

          {/* Services */}
          <div className="bg-white p-2 rounded-lg shadow">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <FaTruck /> Services
            </h3>
            {services.length === 0 ? (
              <p className="text-gray-500">No services found.</p>
            ) : (
              <div className="space-y-4">
                {services.map((srv) => {
                  const serviceImages = Array.isArray(srv.images)
                    ? srv.images
                    : srv.images
                    ? [srv.images]
                    : [];

                  return (
                    <div
                      key={srv._id}
                      className="border-b pb-3 last:border-none flex items-start justify-between relative"
                    >
                      {/* Overlapping circles for service images */}
                      <div className="w-32 mr-4 flex items-center">
                        <OverlappingCircles
                          images={serviceImages}
                          onClickCircle={(index) => openImagePopup(srv, index)}
                        />
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-800">{srv.name}</p>
                        <p className="text-sm text-gray-600">{srv.description}</p>
                        {srv.category && (
                          <div className="mt-1 flex items-center text-xs text-gray-500">
                            <FaTags className="mr-1" />
                            <span>{srv.category.name}</span>
                          </div>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="flex items-center justify-end">
                          <FaCoins className="text-gray-600 mr-1" />
                          <p className="font-bold text-gray-800">${srv.price}</p>
                        </div>
                        <p className="text-sm text-gray-500">{srv.duration} mins</p>
                        <Link
                          to={`/user/booking-manager?tenantId=${tenant._id}&serviceId=${srv._id}`}
                          className={clsx(
                            "mt-2 px-4 py-1 text-sm rounded hover:bg-blue-700 inline-block transition",
                            srv.onSale
                              ? 'bg-red-600 text-white hover:bg-red-700'
                              : 'bg-blue-600 text-white'
                          )}
                        >
                          Book
                          {srv.onSale && <span className="ml-1 text-xs"> (Sale!)</span>}
                        </Link>
                      </div>

                      {srv.onSale && (
                        <div className="absolute top-0 right-0 bg-red-100 text-red-600 px-2 py-1 text-xs rounded-bl">
                          Sale
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Galleries */}
          <div className="bg-white p-6 rounded-lg shadow space-y-6">
            <h3 className="text-xl font-bold">See Our Work</h3>
            {allGalleries.length === 0 ? (
              <p className="text-gray-500">No galleries found.</p>
            ) : (
              <div className="space-y-6">
                {allGalleries.map((gal) => {
                  const currentPage = galleryPages[gal._id] || 1;
                  const limit = currentPage * PAGE_SIZE;
                  const displayedImages = gal.images.slice(0, limit);
                  const canLoadMore = gal.images.length > displayedImages.length;

                  return (
                    <div key={gal._id} className="border p-4 rounded-md shadow-sm">
                      <h4 className="text-lg font-semibold mb-1">{gal.name}</h4>
                      {gal.description && (
                        <p className="text-sm text-gray-600 mb-2">{gal.description}</p>
                      )}

                      {gal.images.length === 0 ? (
                        <p className="text-gray-400">No images yet.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {displayedImages.map((imgUrl, idx) => (
                            <img
                              key={`${gal._id}-img-${idx}`}
                              src={imgUrl || imgStatic}
                              alt="Gallery"
                              className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-90"
                              onClick={() => openLightbox(imgUrl)}
                            />
                          ))}
                        </div>
                      )}

                      {canLoadMore && (
                        <button
                          onClick={() => handleLoadMoreGallery(gal._id)}
                          className="mt-3 px-3 py-1 bg-gray-200 text-sm text-gray-700 rounded hover:bg-gray-300 transition"
                        >
                          Load More
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Reviews */}
          <div className="bg-white p-6 rounded-lg shadow mb-20">
            <ReviewsSection reviews={tenantData?.reviews || []} />
          </div>
        </div>

        {/* Right Column (Sidebar) */}
        <div className="space-y-6">
          {/* About Us */}
          {tenant.aboutUs && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-2 text-lg text-gray-800">About Us</h3>
              <p className="text-sm text-gray-700">{tenant.aboutUs}</p>
            </div>
          )}

          {/* Business Hours */}
          {tenant.settings?.workDays && tenant.settings.workDays.length > 0 && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-lg text-gray-800">
                <FaRegClock />
                Business Hours
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                {tenant.settings.workDays.map((wd, idx) => (
                  <li key={idx} className="flex justify-between">
                    <span>{dayNames[wd.dayOfWeek] || `Day ${wd.dayOfWeek}`}:</span>
                    <span>
                      {wd.openTime} - {wd.closeTime}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Promo (Gift Cards + Tenant Promos) */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-4 flex items-center gap-2 text-lg text-gray-800">
              <FaGift className="text-yellow-600" />
              Promo Code
            </h3>

            {/* If tenant has custom promos, show them as fancy flip-cards */}
            <div className="mt-6">
              <h4 className="text-md font-semibold text-gray-700 mb-2">
                Exclusive Tenant Promos
              </h4>
              {promos.length === 0 ? (
                <p className="text-gray-400 text-sm italic">
                  No exclusive promos at the moment.
                </p>
              ) : (
                <div className="flex flex-wrap gap-4">
                  {promos.map((promo) => (
                    <FancyPromoCard promo={promo} key={promo._id} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Amenities */}
          <div className="bg-white p-6 rounded-lg shadow">
            {tenant.amenities && tenant.amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Amenities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-gray-700">
                  {tenant.amenities.map((am: any) => (
                    <div
                      key={am._id}
                      className="flex items-center bg-gray-100 px-4 py-1 rounded-md shadow-sm hover:shadow-md transition"
                    >
                      <FaCheckCircle className="text-green-500 mr-2" />
                      <span className="font-medium text-xs">{am.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Location Map (if lat & lng exist) */}
          {tenant.locationEnabled && lat !== undefined && lng !== undefined && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="font-bold mb-4 text-lg text-gray-800">Location</h3>
              <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: '300px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={[lat, lng]}
                  icon={L.icon({
                    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                  })}
                >
                  <Popup>{tenant.name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          )}

          {/* Additional Actions */}
          <div className="bg-white p-6 rounded-lg shadow flex justify-around mb-20">
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm">
              <FaRegHeart /> <span>Add to Favorites</span>
            </button>
            <button className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm">
              <FaRegShareSquare /> <span>Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal for GALLERY images */}
      {lightboxOpen && lightboxImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeLightbox}
          >
            <FaTimes />
          </button>
          <motion.img
            src={lightboxImage}
            alt="Lightbox"
            className="max-h-full max-w-full rounded shadow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          />
        </div>
      )}

      {/* Lightbox Modal for SERVICE images */}
      {imagePopup.open && imagePopup.service && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={closeImagePopup}
          >
            <FaTimes />
          </button>

          {/* MAIN IMAGE */}
          <motion.img
            src={
              imagePopup.service.images[imagePopup.currentImageIndex] ||
              imgStatic
            }
            alt="Service popup"
            className="max-h-full max-w-full rounded shadow"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          />

          {/* Prev / Next Buttons if multiple images */}
          {imagePopup.service.images.length > 1 && (
            <>
              <button
                className="absolute left-8 text-white text-3xl bg-gray-700 bg-opacity-50 p-2 rounded"
                onClick={prevImage}
              >
                <FaChevronLeft />
              </button>
              <button
                className="absolute right-8 text-white text-3xl bg-gray-700 bg-opacity-50 p-2 rounded"
                onClick={nextImage}
              >
                <FaChevronRight />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default BusinessDetailPage;
