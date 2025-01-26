/**
 * Basic shape of a Review resource from your back end.
 * Adjust fields as needed:
 */
export interface Review {
    _id: string;
    booking: string;     // booking _id
    service: string;     // service _id
    tenant: string;      // tenant _id
    user?: string;       // user _id if logged in
    nonUserEmail?: string;
    rating: number;      // e.g. 1-5
    comment?: string;
    isPublished: boolean; 
    ownerReply?: string; // reply from staff/owner
    createdAt: string;
    updatedAt: string;
  }
  
  /**
   * For listing reviews, your server might return an array.
   * e.g. GET /reviews/service/:serviceId => { success: true, data: Review[] }
   */
  export interface ReviewListResponse {
    success: boolean;
    data: Review[];
  }
  
  /**
   * For a single review response
   * e.g. POST /reviews => { success: true, data: Review }
   */
  export interface ReviewResponse {
    success: boolean;
    data: Review;
  }
  
  /**
   * For creating a review
   */
  export interface CreateReviewRequest {
    bookingId: string; 
    rating: number;    
    comment?: string;  
    nonUserEmail?: string; 
  }
  
  /**
   * For replying to a review
   */
  export interface ReplyReviewRequest {
    reviewId: string;
    reply: string;
  }
  
  /**
   * For approving a review (below threshold)
   */
  export interface ApproveReviewRequest {
    reviewId: string;
  }
  
  /**
   * For listing reviews for a service
   */
  export interface ListReviewsParams {
    serviceId: string;
  }
  