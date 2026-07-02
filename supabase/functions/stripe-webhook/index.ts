import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import Stripe from "https://esm.sh/stripe@12.0.0?target=deno";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL") || "",
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
);

serve(async (req) => {
  const signature = req.headers.get("Stripe-Signature");
  const body = await req.text();
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get("STRIPE_WEBHOOK_SECRET") || ""
    );
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const priceId = session.line_items?.data[0].price.id;
      const userId = session.client_reference_id; // Pass this in your frontend checkout

      // Map Price IDs to your Tags
      const tagMap: Record<string, string> = {
        'price_1TobnLGktcOyaRvBO0XpSswR': 'pro',
        'price_1Tobo0GktcOyaRvBg9hIpYJl': 'newsfeed',
        'price_1ToboLGktcOyaRvBlDgXNtp0': 'audio_squawk'
      };

      const tag = tagMap[priceId] || 'free';

      await supabase
        .from('profiles')
        .update({ subscription_tag: tag })
        .eq('id', userId);
      break;
    }
    // Add additional cases here (e.g., subscription.deleted)
  }

  return new Response(JSON.stringify({ received: true }), { status: 200 });
});
