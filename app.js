import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Replace these placeholders with your actual data from Supabase/Paddle dashboards
const supabase = createClient('https://fgidelsazisdqjfckerd.supabase.co', 'sb_publishable_XNB_OHf-d3DxRyalRCbThg_iK4Z56zx')

Paddle.Initialize({ token: 'test_f5e2134eb7be19e0c9d8f861e1e' });

document.getElementById('upgrade-btn').addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { alert("Please log in first!"); return; }

    Paddle.Checkout.open({
        items: [{ priceId: 'pro_01kwg9nv64zsgdrpg4a8xdcqb1', quantity: 1 }],
        customData: { user_id: user.id }
    })
})
