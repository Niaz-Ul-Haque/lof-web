'use client';

import React from 'react';

const DiscordIframe: React.FC = () => {
  return (
    <div className="mt-16 bg-dark-200 rounded-lg p-6">
      <h2 className="section-title-iframe font-semibold text-center mb-6">
        Current Discord Live Status
      </h2>
      <div className="overflow-hidden flex justify-center">
        {/* Using dangerouslySetInnerHTML to directly insert the iframe with the correct HTML attributes */}
        <div
          className="w-full max-w-4xl min-w-[280px] h-[300px]"
          dangerouslySetInnerHTML={{
            __html: `
              <iframe
                src="https://discord.com/widget?id=1081522410332889148&theme=dark"
                width="100%"
                height="100%"
                style="border: none; border-radius: 0.5rem;"
                allowtransparency="true"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts">
              </iframe>
            `,
          }}
        />
      </div>
    </div>
  );
};

export default DiscordIframe;
