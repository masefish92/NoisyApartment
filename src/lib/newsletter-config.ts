/**
 * Single config point for the email list provider. No endpoint is committed
 * here — set NEXT_PUBLIC_NEWSLETTER_ENDPOINT in your environment once a
 * provider (e.g. Buttondown, ConvertKit, Mailchimp) is chosen.
 *
 * TODO: point this at your provider's subscribe endpoint (one that accepts a
 * POST with a JSON body like { email }). Until it's set, NewsletterForm still
 * renders and shows a success state client-side so the UI can be reviewed
 * with zero setup — no email is actually captured anywhere.
 */
export const NEWSLETTER_ENDPOINT = process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT;
