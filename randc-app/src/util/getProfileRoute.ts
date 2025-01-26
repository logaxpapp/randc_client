export function getProfileRoute(user: any): string {
    if (!user) {
      return '/'; // or a login route if not logged in
    }
    // If the user has multiple roles, pick the one you care about, or handle all
    if (user.roles?.includes('ADMIN')) {
      return '/admin/dashboard/profile';
    } else if (user.roles?.includes('CLEANER')) {
      return '/cleaner/dashboard/profile';
    } else {
      return '/user/dashboard/profile';
    }
  }
  