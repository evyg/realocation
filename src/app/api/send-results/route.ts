import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Initialize Resend lazily to avoid build-time errors
function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY is not configured');
  }
  return new Resend(apiKey);
}

interface CityResult {
  name: string;
  state: string;
  monthlySurplus: number;
  difference: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, salary, currentCity, results } = body as {
      email: string;
      salary: number;
      currentCity: { name: string; state: string; monthlySurplus: number };
      results: CityResult[];
    };

    if (!email || !salary || !currentCity || !results) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Format currency helper
    const fmt = (n: number) => 
      new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

    // Build the results table
    const citiesList = results
      .slice(0, 10)
      .map((r, i) => `
        <tr style="border-bottom: 1px solid #e5e7eb;">
          <td style="padding: 12px 8px; color: #374151;">#${i + 1}</td>
          <td style="padding: 12px 8px; font-weight: 500; color: #111827;">${r.name}, ${r.state}</td>
          <td style="padding: 12px 8px; text-align: right; color: #059669; font-weight: 600;">
            +${fmt(r.difference)}/mo
          </td>
          <td style="padding: 12px 8px; text-align: right; color: #6b7280;">
            ${fmt(r.monthlySurplus)}/mo
          </td>
        </tr>
      `)
      .join('');

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 32px 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Your Realocation Results</h1>
      <p style="color: #bfdbfe; margin: 8px 0 0 0; font-size: 16px;">Salary: ${fmt(salary)}</p>
    </div>
    
    <!-- Current City -->
    <div style="padding: 24px; background-color: #eff6ff; border-bottom: 1px solid #dbeafe;">
      <p style="margin: 0 0 8px 0; font-size: 12px; text-transform: uppercase; color: #6b7280; letter-spacing: 0.05em;">Currently in</p>
      <h2 style="margin: 0; color: #111827; font-size: 20px;">${currentCity.name}, ${currentCity.state}</h2>
      <p style="margin: 8px 0 0 0; color: #4b5563;">Monthly surplus: <strong>${fmt(currentCity.monthlySurplus)}</strong></p>
    </div>
    
    <!-- Results -->
    <div style="padding: 24px;">
      <h3 style="margin: 0 0 16px 0; color: #111827; font-size: 18px;">
        🎯 Top ${results.length > 10 ? '10' : results.length} cities where you'd have MORE
      </h3>
      
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <thead>
          <tr style="background-color: #f9fafb;">
            <th style="padding: 10px 8px; text-align: left; color: #6b7280; font-weight: 500;">Rank</th>
            <th style="padding: 10px 8px; text-align: left; color: #6b7280; font-weight: 500;">City</th>
            <th style="padding: 10px 8px; text-align: right; color: #6b7280; font-weight: 500;">vs. Now</th>
            <th style="padding: 10px 8px; text-align: right; color: #6b7280; font-weight: 500;">Surplus</th>
          </tr>
        </thead>
        <tbody>
          ${citiesList}
        </tbody>
      </table>
      
      ${results.length > 10 ? `
        <p style="margin: 16px 0 0 0; padding: 12px; background-color: #fef3c7; border-radius: 8px; text-align: center; color: #92400e; font-size: 14px;">
          📊 ${results.length - 10} more cities available in full results
        </p>
      ` : ''}
    </div>
    
    <!-- CTA -->
    <div style="padding: 24px; background-color: #f9fafb; text-align: center;">
      <a href="https://realocation.app" style="display: inline-block; padding: 14px 28px; background-color: #2563eb; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
        Run Another Calculation →
      </a>
    </div>
    
    <!-- Footer -->
    <div style="padding: 20px 24px; border-top: 1px solid #e5e7eb; text-align: center;">
      <p style="margin: 0; color: #9ca3af; font-size: 12px;">
        Calculations based on 2024 federal and state tax rates. Cost of living data updated monthly.
      </p>
      <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
        © ${new Date().getFullYear()} Realocation
      </p>
    </div>
  </div>
</body>
</html>
    `;

    const resend = getResend();
    const { data, error } = await resend.emails.send({
      from: 'Realocation <results@realocation.app>',
      to: email,
      subject: `Your Realocation Results: ${results.length} cities where ${fmt(salary)} goes further`,
      html: emailHtml,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
