export abstract class AbstractCurrentUserService {
  abstract getUserId(): string;
  abstract getUserRole(): string;
  abstract getUserEmail(): string;
}