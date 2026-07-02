import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient('https://fgidelsazisdqjfckerd.supabase.co', 'sb_publishable_XNB_OHf-d3DxRyalRCbThg_iK4Z56zx')

Paddle.Initialize({ token: 'test_f5e2134eb7be19e0c9d8f861e1e' });

// Add this Login handler
document.getElementById('login-btn').addEventListener('click', async () => {
    // This logs you in with test credentials you have in Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'password123'
    })
    if (error) alert(error.message)
    else alert("Logged in!")
})

document.getElementById('upgrade-btn').addEventListener('click', async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
        alert("Please log in first!")
        return
    }

    Paddle.Checkout.open({
        items: [{ priceId: 'pro_01kwg9nv64zsgdrpg4a8xdcqb1', quantity: 1 }],
        customData: { user_id: user.id }
    })
})





